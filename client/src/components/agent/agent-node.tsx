import { Card } from "@/components/ui/card";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MessageSquare, ArrowRight, AlertCircle, FileQuestion } from "lucide-react";

interface AgentNodeProps {
  id: string;
  type: "message" | "condition" | "input" | "api";
}

const nodeIcons = {
  message: MessageSquare,
  condition: AlertCircle,
  input: FileQuestion,
  api: ArrowRight,
};

const nodeColors = {
  message: "bg-blue-50 border-blue-200",
  condition: "bg-yellow-50 border-yellow-200",
  input: "bg-purple-50 border-purple-200",
  api: "bg-green-50 border-green-200",
};

export function AgentNode({ id, type }: AgentNodeProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = nodeIcons[type];

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className={`p-4 mb-2 border-2 ${nodeColors[type]} cursor-move`}>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="font-medium capitalize">{type}</span>
        </div>
      </Card>
    </div>
  );
} 