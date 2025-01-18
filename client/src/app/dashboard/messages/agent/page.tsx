"use client";

import { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  Connection,
  Node,
  addEdge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  ReactFlowProvider,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlowNode } from "@/components/agent/flow-node";
import { MessageSquare, ArrowRight, AlertCircle, FileQuestion } from "lucide-react";
import { nanoid } from "nanoid";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const nodeTypes: NodeTypes = {
  custom: FlowNode,
};

const availableNodes = [
  { type: "message", icon: MessageSquare, label: "Message" },
  { type: "condition", icon: AlertCircle, label: "Condition" },
  { type: "input", icon: FileQuestion, label: "Input" },
  { type: "api", icon: ArrowRight, label: "API" },
] as const;

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = project({
        x: event.clientX - reactFlowWrapper.current!.getBoundingClientRect().left,
        y: event.clientY - reactFlowWrapper.current!.getBoundingClientRect().top,
      });

      const newNode: Node = {
        id: `${type}-${nanoid()}`,
        type: "custom",
        position,
        data: { type, label: type },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [project, setNodes]
  );

  const handleSave = () => {
    console.log("Saving flow:", { nodes, edges });
    // TODO: Implement save functionality
  };

  return (
    <>
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex w-full items-center gap-2 px-4 lg:px-8">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>WhatsApp Agent Builder</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
    <div className="h-screen w-screen">
      <div ref={reactFlowWrapper} className="h-full w-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background"
        >
          <Background gap={12} size={1} />
          <Controls className="bg-background/95 border shadow-sm" />
          
          <Panel position="top-center" className="bg-background/95 border shadow-sm rounded-lg">
            <div className="px-4 py-2 flex items-center gap-4">
              <h1 className="text-xl font-semibold">WhatsApp Agent Builder</h1>
              <Button onClick={handleSave} size="sm">Save Flow</Button>
            </div>
          </Panel>

          <Panel position="top-left" className="m-4">
            <Card className="w-[250px] p-4 shadow-lg bg-background/95">
              <h2 className="text-sm font-medium mb-3">Available Nodes</h2>
              <div className="space-y-2">
                {availableNodes.map((node) => (
                  <div
                    key={node.type}
                    className="cursor-move"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData(
                        "application/reactflow",
                        node.type
                      );
                      event.dataTransfer.effectAllowed = "move";
                    }}
                  >
                    <FlowNode
                      data={{
                        type: node.type,
                        label: node.label,
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </Panel>
        </ReactFlow>
      </div>
    </div>
    </>
  );
}

export default function MessagesAgentPage() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
} 