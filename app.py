from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
import os, ast, git, tempfile
import uvicorn

# --- MySQL Database Setup using SQLAlchemy ---
from sqlalchemy import create_engine, Column, Integer, String, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext

# Update these credentials for your MySQL database
DATABASE_URL = "mysql+pymysql://user:password@localhost/dbname"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# SQLAlchemy User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(128))

# Create database tables (if they do not exist)
Base.metadata.create_all(bind=engine)

# --- FastAPI App Initialization ---
app = FastAPI(title="Code Analysis API with Authentication")

# --- Mock Database for Code Analysis Endpoints ---
mock_db: Dict[str, dict] = {}

# Folder for code analysis endpoints (for endpoints 1 and 2)
REPO_DIR = "code"  # Make sure a folder named "code" exists with your source files

# Dependency: Provide SQLAlchemy DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Utility Functions for Code Analysis ---
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

# --- Endpoint 1: Get all custom function calls ---
@app.get("/functions")
def get_custom_function_calls(extension: str = ".py"):
    files = get_files_by_extension(REPO_DIR, extension)
    if not files:
        raise HTTPException(status_code=404, detail="No files found with the given extension")
    custom_funcs = set()
    # First pass: collect custom function definitions
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                source = f.read()
            tree = ast.parse(source, filename=file_path)
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    custom_funcs.add(node.name)
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
    # Second pass: find calls to custom-defined functions
    function_calls = []
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                source = f.read()
            tree = ast.parse(source, filename=file_path)
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    func_name = get_func_name(node.func)
                    if func_name in custom_funcs:
                        function_calls.append({
                            "file": file_path,
                            "function_call": func_name,
                            "line": node.lineno
                        })
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
    return {"custom_function_calls": function_calls}

# --- Endpoint 2: Get complete source code for a given function ---
@app.get("/function/{function_name}")
def get_function_code(function_name: str, extension: str = ".py"):
    files = get_files_by_extension(REPO_DIR, extension)
    if not files:
        raise HTTPException(status_code=404, detail="No files found with the given extension")
    results = []
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                source = f.read()
            tree = ast.parse(source, filename=file_path)
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef) and node.name == function_name:
                    if hasattr(node, "end_lineno"):
                        lines = source.splitlines()
                        code_snippet = "\n".join(lines[node.lineno - 1: node.end_lineno])
                        results.append({"file": file_path, "code": code_snippet})
                    else:
                        results.append({"file": file_path, "code": f"Function at line {node.lineno} in {file_path}"})
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
    if not results:
        raise HTTPException(status_code=404, detail="Function not found")
    return {"functions": results}

# --- Pydantic Model for Code-based AI Endpoints ---
class CodeInput(BaseModel):
    code: str

# --- Endpoint 3: AI suggestion for the given code ---
@app.post("/ai/suggestion")
def ai_suggestion(input: CodeInput):
    code = input.code
    suggestion = ("The code is concise; however, consider adding error handling and comments for clarity."
                  if len(code) < 100
                  else "The code is lengthy; consider refactoring into smaller, modular functions.")
    return {"suggestion": suggestion}

# --- Endpoint 4: AI summary for the given code ---
@app.post("/ai/summary")
def ai_summary(input: CodeInput):
    code = input.code
    summary = f"This code snippet has {len(code.splitlines())} lines and may benefit from further analysis."
    return {"summary": summary}

# --- Endpoint 5: AI code optimization for the given code ---
@app.post("/ai/optimize")
def ai_optimize(input: CodeInput):
    code = input.code
    optimized_code = "# Optimized version\n" + code
    return {"optimized_code": optimized_code}

# --- Endpoint 6: Ingest a GitHub repo and store details in a mock database ---
class RepoInput(BaseModel):
    repo_url: str

@app.post("/repo/ingest")
def ingest_repo(repo: RepoInput, extension: str = ".py"):
    tmp_dir = tempfile.mkdtemp()
    try:
        git.Repo.clone_from(repo.repo_url, tmp_dir)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error cloning repository: {e}")
    files = get_files_by_extension(tmp_dir, extension)
    if not files:
        raise HTTPException(status_code=404, detail="No files found with the given extension in the repository")
    custom_funcs = set()
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                source = f.read()
            tree = ast.parse(source, filename=file_path)
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    custom_funcs.add(node.name)
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
    function_calls = []
    for file_path in files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                source = f.read()
            tree = ast.parse(source, filename=file_path)
            for node in ast.walk(tree):
                if isinstance(node, ast.Call):
                    func_name = get_func_name(node.func)
                    if func_name in custom_funcs:
                        function_calls.append({
                            "file": file_path,
                            "function_call": func_name,
                            "line": node.lineno
                        })
        except Exception as e:
            print(f"Error parsing {file_path}: {e}")
    repo_details = {
        "repo_url": repo.repo_url,
        "custom_functions": list(custom_funcs),
        "function_calls": function_calls
    }
    mock_db[repo.repo_url] = repo_details
    return {"message": "Repository ingested successfully", "repo_details": repo_details}

# --- Authentication Endpoints (Sign Up & Login) ---

# Pydantic models for user sign up and login
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# Utility functions for password hashing and verification
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Endpoint 7: User Sign Up
@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = db.query(User).filter(or_(User.username == user.username, User.email == user.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")
    hashed_pw = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

# Endpoint 8: User Login
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if not existing_user or not verify_password(user.password, existing_user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    return {"message": "Login successful", "user_id": existing_user.id}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
