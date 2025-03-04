import os
import ast
import git
import json
import tempfile
from typing import List, Dict, Generator

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import create_engine, Column, Integer, String, Text, Boolean, and_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware

# -------------------- Database Setup --------------------
# Update this connection string with your MySQL credentials and database name.
DATABASE_URL = "mysql+pymysql://root:mysql%40R1@127.0.0.1/vireon"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# -------------------- Models --------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(128), nullable=False)
    is_verified = Column(Boolean, default=False)


class CodeProject(Base):
    __tablename__ = "code_projects"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    project_name = Column(String(100), nullable=False)
    repo_url = Column(String(255), nullable=False)
    # Store call tree data as JSON string.
    ast_data = Column(Text, nullable=False)


Base.metadata.create_all(bind=engine)

# -------------------- Password Hashing --------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


# -------------------- FastAPI Initialization --------------------
app = FastAPI(title="Production-Ready Code Analysis API")

# Enable CORS
origins = [
    "http://localhost:5173",  # Vite development server
    # Add other origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency: Provide DB session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- Pydantic Schemas --------------------
class SignupInput(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=3)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class RepoParseInput(BaseModel):
    repo_url: str
    username: str
    project_name: str


class CodeSnippet(BaseModel):
    code: str


# -------------------- Utility Functions for Code Parsing & Call Tree Building --------------------
def get_files_by_extension(directory: str, extension: str) -> List[str]:
    files_list = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(extension):
                files_list.append(os.path.join(root, file))
    return files_list


def get_func_name(node) -> str:
    if isinstance(node, ast.Name):
        return node.id
    elif isinstance(node, ast.Attribute):
        value = get_func_name(node.value)
        return f"{value}.{node.attr}" if value else node.attr
    return "<unknown>"


def build_call_tree_from_file(file_path: str) -> List[Dict]:
    """
    Parse a Python file and build a call tree for its user-defined functions.
    Each node contains:
      - function: function name
      - code: source code of the function
      - calls: list of child nodes representing functions called within it
    Only functions that are not called by any other function are returned as roots.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        source = f.read()
    try:
        module_tree = ast.parse(source)
    except Exception as e:
        raise ValueError(f"Error parsing {file_path}: {e}")

    # Collect top-level function definitions.
    func_defs = {node.name: node for node in module_tree.body if isinstance(node, ast.FunctionDef)}
    source_lines = source.splitlines()

    def get_source(node: ast.FunctionDef) -> str:
        start = node.lineno - 1
        end = node.end_lineno if hasattr(node, "end_lineno") else node.lineno
        return "\n".join(source_lines[start:end])

    def build_tree(node: ast.FunctionDef, visited=None) -> Dict:
        if visited is None:
            visited = set()
        if node.name in visited:
            return {"function": node.name, "code": get_source(node), "calls": []}
        visited.add(node.name)
        child_nodes = {}
        for subnode in ast.walk(node):
            if isinstance(subnode, ast.Call):
                func_name = get_func_name(subnode.func)
                if func_name in func_defs and func_name not in child_nodes:
                    child_nodes[func_name] = build_tree(func_defs[func_name], visited.copy())
        return {"function": node.name, "code": get_source(node), "calls": list(child_nodes.values())}

    all_trees = [build_tree(func) for func in func_defs.values()]

    def gather_called(tree: Dict) -> set:
        result = set()
        for child in tree.get("calls", []):
            result.add(child["function"])
            result.update(gather_called(child))
        return result

    called_set = set()
    for tree in all_trees:
        called_set.update(gather_called(tree))

    roots = [tree for tree in all_trees if tree["function"] not in called_set]
    return roots


def parse_functions_from_code(source: str) -> List[Dict]:
    """
    Parse the source code for function definitions and return a list of
    dictionaries with function name, code, and its AST dump.
    Used for the AI endpoints.
    """
    try:
        tree = ast.parse(source)
    except Exception as e:
        raise ValueError(f"Error parsing code: {e}")

    functions = []
    for node in ast.walk(tree):
        if isinstance(node, ast.FunctionDef):
            func_ast = ast.dump(node)
            start = node.lineno - 1
            end = node.end_lineno if hasattr(node, "end_lineno") else node.lineno
            code_snippet = "\n".join(source.splitlines()[start:end])
            functions.append({
                "function": node.name,
                "code": code_snippet,
                "ast": func_ast
            })
    return functions


# -------------------- Endpoints --------------------

@app.post("/signup")
def signup(user: SignupInput, db: Session = Depends(get_db)):
    print(user)
    existing = db.query(User).filter(
        (User.username == user.username) | (User.email == user.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_pw = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw,
        is_verified=False  # In production, implement email verification.
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}


@app.post("/login")
def login(user: LoginInput, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    # In production, return a JWT token here.
    return {"message": "Login successful", "user": db_user}

@app.get('/')
def helo():
    return 'hi'

@app.get('/profile/{userid}')
def profile(userid:int,db: Session = Depends(get_db)):
    user=db.query(User).filter(User.id==userid).first()
    if not user :
        return 'please login'
    return user

@app.get('/userprjs/{userid}')
def userprjs(userid:int,db: Session = Depends(get_db)):
    user=db.query(User).filter(User.id==userid).first()
    if user :
        user_prjs=db.query(CodeProject).filter(user.username==CodeProject.username).all()
        return user_prjs
    return 'err'

@app.post("/repo/parse")
def parse_and_store_repo(repo_input: RepoParseInput, db: Session = Depends(get_db)):
    tmp_dir = tempfile.mkdtemp()
    try:
        git.Repo.clone_from(repo_input.repo_url, tmp_dir)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error cloning repository: {e}")

    files = get_files_by_extension(tmp_dir, ".py")
    if not files:
        raise HTTPException(status_code=404, detail="No Python files found in the repository")

    all_call_trees = []
    for file_path in files:
        try:
            rel_path = os.path.relpath(file_path, tmp_dir)
            tree = build_call_tree_from_file(file_path)
            all_call_trees.append({
                "file": rel_path,
                "call_tree": tree
            })
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

    project = CodeProject(
        username=repo_input.username,
        project_name=repo_input.project_name,
        repo_url=repo_input.repo_url,
        ast_data=json.dumps(all_call_trees)
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return {"message": "Repository parsed and call tree stored successfully", "project_id": project.id,"name":project.project_name}


@app.get("/ast")
def get_project_ast(username: str, project_name: str,id:int ,db: Session = Depends(get_db)):
    project = db.query(CodeProject).filter(
        and_(CodeProject.username == username, CodeProject.project_name == project_name,CodeProject.id==id)
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    call_tree_data = json.loads(project.ast_data)
    return {"username": username, "project_name": project_name, "call_trees": call_tree_data}


@app.post("/ai/summary")
def ai_summary(code_snippet: CodeSnippet):
    code = code_snippet.code
    summary = f"This function appears to have {len(code.splitlines())} lines and performs specific operations."
    try:
        func_ast = parse_functions_from_code(code)
    except Exception as e:
        func_ast = f"Error parsing AST: {e}"
    return {"summary": summary, "ast": func_ast}


@app.post("/ai/optimize")
def ai_optimize(code_snippet: CodeSnippet):
    code = code_snippet.code
    optimization = "Consider refactoring loops and reducing redundant computations for better performance."
    try:
        func_ast = parse_functions_from_code(code)
    except Exception as e:
        func_ast = f"Error parsing AST: {e}"
    return {"optimization": optimization, "ast": func_ast}


@app.post("/ai/suggest")
def ai_suggest(code_snippet: CodeSnippet):
    code = code_snippet.code
    suggestion = "Improve variable naming and add inline comments for clarity."
    try:
        func_ast = parse_functions_from_code(code)
    except Exception as e:
        func_ast = f"Error parsing AST: {e}"
    return {"suggestion": suggestion, "ast": func_ast}


# -------------------- Run the Application --------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)