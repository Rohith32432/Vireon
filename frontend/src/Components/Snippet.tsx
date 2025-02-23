import { useEffect, useRef } from 'react';
import hljs from 'highlight.js';
// import 'highlight.js/styles/dracula.css'; // Import the Dracula theme

function Snippet() {
  const codeRef = useRef<HTMLPreElement | null>(null); // Use a more specific type for the ref

  function generateCode(codeString: string): string {
    let formattedCode = codeString
      .split('\n')  // Split the code by newlines
      .map(line => line.trim())  // Trim each line to clean up extra spaces
      .join('\n');  // Join the lines back with a newline separator
        
    return formattedCode;
  }

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current); // Use the proper method for highlighting
    }
  }, []);

  const codeString = `def Agent(url="https://medium.com/dataherald/how-to-langchain-sqlchain-c7342dd41614"):
    data = Scraped_data(url)
    chunks = chunked_data(data)
    vector = vector_model(chunks)
    agent = get_agent(vector)
    return agent`;

  const formattedCodeString = generateCode(codeString);

  return (
    <div className="w-[500px]">
      <pre ref={codeRef} className="hljs">
        <code className="python">
          {formattedCodeString}
        </code>
      </pre>
    </div>
  );
}

export default Snippet;
