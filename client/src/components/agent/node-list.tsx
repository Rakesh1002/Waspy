import { Card } from "@/components/ui/card";
import { useDroppable } from "@dnd-kit/core";
import { AgentNode } from "./agent-node";

const availableNodes = [
  { id: "message-template", type: "message" },
  { id: "condition-template", type: "condition" },
  { id: "input-template", type: "input" },
  { id: "api-template", type: "api" },
] as const;

export function NodeList() {
  const { setNodeRef } = useDroppable({
    id: "available-nodes",
  });

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Available Nodes</h2>
      <div ref={setNodeRef} className="space-y-2">
        {availableNodes.map((node) => (
          <AgentNode key={node.id} id={node.id} type={node.type} />
        ))}
      </div>
    </Card>
  );
}
