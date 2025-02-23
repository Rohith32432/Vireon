import { CodeBlock, dracula } from 'react-code-blocks';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Modal({ show, setshow, data }) {
  function generateCode(codeString) {
    let formattedCode = codeString
      .split('\n')   
      .map(line => line.trim())  
      .join(';\n');
      
    return formattedCode;
  }

  return (
    <Dialog open={show} onOpenChange={setshow}>
      <DialogContent className="sm:min-w-[425px]">
        <DialogHeader>
          <DialogTitle>code</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>
        
        <CodeBlock
          text={generateCode(data)}  
          language="python"
          showLineNumbers={true}
          theme={dracula}
        />
        
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
