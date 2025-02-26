import { CodeBlock, dracula, monokai } from 'react-code-blocks';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
      <DialogContent className="sm:min-w-[425px] ">

        <div className='flex flex-col items-start'>
          <Tabs defaultValue="code">
            <TabsList>
              <TabsTrigger value='code'>code</TabsTrigger>
              <TabsTrigger value="optimized">Optimized Version</TabsTrigger>
              <TabsTrigger value="debugging">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value='code' className='relative overflow-hidden w-[450px]'>
              <CodeBlock
                text={data ? generateCode(data) : ''}
                language="python"
                showLineNumbers={true}
                theme={monokai}
              />

            </TabsContent>
            <TabsContent value='optimized'>
              <h1>yet to come</h1>
            </TabsContent>

          </Tabs>


        </div>
      </DialogContent>
    </Dialog>
  );
}
