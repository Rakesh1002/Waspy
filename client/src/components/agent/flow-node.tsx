import { Handle, Position } from 'reactflow';
import { Card } from "@/components/ui/card";
import { MessageSquare, ArrowRight, AlertCircle, FileQuestion } from "lucide-react";

const nodeIcons = {
  message: MessageSquare,
  condition: AlertCircle,
  input: FileQuestion,
  api: ArrowRight,
};

const nodeColors = {
  message: "bg-blue-50/80 border-blue-200 hover:bg-blue-50",
  condition: "bg-yellow-50/80 border-yellow-200 hover:bg-yellow-50",
  input: "bg-purple-50/80 border-purple-200 hover:bg-purple-50",
  api: "bg-green-50/80 border-green-200 hover:bg-green-50",
};

const handleStyles = {
  message: "!bg-blue-400",
  condition: "!bg-yellow-400",
  input: "!bg-purple-400",
  api: "!bg-green-400",
};

interface FlowNodeProps {
  data: {
    type: "message" | "condition" | "input" | "api";
    label: string;
  };
}

export function FlowNode({ data }: FlowNodeProps) {
  const Icon = nodeIcons[data.type];

  return (
    <div className="relative group">
      <Handle
        type="target"
        position={Position.Top}
        className={`w-3 h-3 transition-all opacity-0 group-hover:opacity-100 ${handleStyles[data.type]}`}
      />
      <Card 
        className={`
          p-4 border-2 ${nodeColors[data.type]} min-w-[200px]
          transition-all duration-200
          shadow-lg hover:shadow-xl
          backdrop-blur-sm
          scale-100 hover:scale-105
        `}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <span className="font-medium capitalize">{data.label || data.type}</span>
        </div>
      </Card>
      <Handle
        type="source"
        position={Position.Bottom}
        className={`w-3 h-3 transition-all opacity-0 group-hover:opacity-100 ${handleStyles[data.type]}`}
      />
    </div>
  );
} 