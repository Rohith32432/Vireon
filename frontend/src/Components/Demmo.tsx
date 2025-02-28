import React, { FC, useCallback, useState } from "react";
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Modal from "./Modal";


const processCallTreeToGraph = (data: any) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  let nodeIndex = 0; // Unique index for nodes
  let xSpacing = 250; // Horizontal spacing
  let ySpacing = 30; // Vertical spacing

  function traverse(obj: any, parentId: string | null, depth: number, yPos: number): number {
    const id = `node-${nodeIndex++}`;
    const label = obj.file || obj.function || "Unnamed";
    nodes.push({
      id,
      data: { label,code: obj?.code ||'no code' },
      position: { x: depth * xSpacing, y: yPos },
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        animated: true,
      });
    }

    let nextYPos = yPos; // Track position for child nodes

    if (obj.call_tree && Array.isArray(obj.call_tree)) {
      obj.call_tree.forEach((child, index) => {
        nextYPos = traverse(child, id, depth + 1, nextYPos + index * ySpacing);
      });
    }

    if (obj.calls && Array.isArray(obj.calls)) {
      obj.calls.forEach((child, index) => {
        nextYPos = traverse(child, id, depth + 1, nextYPos + index * ySpacing);
      });
    }

    return nextYPos + ySpacing;
  }

  let yPosition = 0;
  data.forEach((entry: any) => {
    yPosition = traverse(entry, null, 0, yPosition);
    yPosition += 200; // Space out separate trees
  });

  return { nodes, edges };
};

function Demo ({chartdata}) {
  const { nodes: initialNodes, edges: initialEdges } = processCallTreeToGraph(chartdata.call_trees);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [staus,setstaus]=useState(false)
  const[code,setcode]=useState('')
  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
const handleNodeClick = (event: React.MouseEvent, node: Node) => {
  const {data}=node
  setstaus(!staus)
  setcode(data?.code)
};
  return (
    <div className="w-[80vw] h-[80vh] rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
      </ReactFlow>
      <Modal setshow={setstaus} show={staus} data={code}/>
    </div>
  );
};

export default Demo;
