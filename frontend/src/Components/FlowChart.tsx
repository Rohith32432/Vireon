import React, { FC, useCallback } from 'react';
import {
  Background,
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'node-1',
    sourcePosition: 'right',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: 'node-2',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'node-3',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 3' },
    position: { x: 250, y: 160 },
  },
  {
    id: 'node-4',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 4' },
    position: { x: 500, y: 0 },
  },
  {
    id: 'node-5',
    sourcePosition: 'top',
    targetPosition: 'bottom',
    data: { label: 'Node 5' },
    position: { x: 500, y: 100 },
  },
  {
    id: 'node-6',
    sourcePosition: 'bottom',
    targetPosition: 'top',
    data: { label: 'Node 6' },
    position: { x: 500, y: 230 },
  },
  {
    id: 'node-7',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 7' },
    position: { x: 750, y: 50 },
  },
  {
    id: 'node-8',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'Node 8' },
    position: { x: 750, y: 300 },
  },
];

const initialEdges = [
  {
    id: 'edge-1-2',
    source: 'node-1',
    type: 'smoothstep',
    target: 'node-2',
    animated: true,
  },
  {
    id: 'edge-1-3',
    source: 'node-1',
    type: 'smoothstep',
    target: 'node-3',
    animated: true,
  },
  {
    id: 'edge-2-4',
    source: 'node-2',
    type: 'smoothstep',
    target: 'node-4',
    label: 'edge label',
  },
  {
    id: 'edge-3-5',
    source: 'node-3',
    type: 'smoothstep',
    target: 'node-5',
    animated: true,
  },
  {
    id: 'edge-3-6',
    source: 'node-3',
    type: 'smoothstep',
    target: 'node-6',
    animated: true,
  },
  {
    id: 'edge-5-7',
    source: 'node-5',
    type: 'smoothstep',
    target: 'node-7',
    animated: true,
  },
  {
    id: 'edge-6-8',
    source: 'node-6',
    type: 'smoothstep',
    target: 'node-8',
    animated: true,
  },
];

const FlowChart: FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-[90vw] h-[70vh] rounded-xl border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <Background />
      </ReactFlow>
    </div>
  );
};

export default FlowChart;
