import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AgentNode } from "./agent-node";

interface FlowNode {
  id: string;
  type: "message" | "condition" | "input" | "api";
}

interface FlowBuilderProps {
  nodes: FlowNode[];
}

export function FlowBuilder({ nodes }: FlowBuilderProps) {
  const { setNodeRef } = useDroppable({
    id: "flow-builder",
  });

  return (
    <Card className="p-4 min-h-[400px]">
      <h2 className="text-lg font-semibold mb-4">Flow Builder</h2>
      <div
        ref={setNodeRef}
        className="space-y-2 min-h-[300px] border-2 border-dashed rounded-lg p-4"
      >
        <SortableContext
          items={nodes.map((node) => node.id)}
          strategy={verticalListSortingStrategy}
        >
          {nodes.map((node) => (
            <AgentNode
              key={node.id}
              id={node.id}
              type={node.type}
            />
          ))}
        </SortableContext>
      </div>
    </Card>
  );
} 