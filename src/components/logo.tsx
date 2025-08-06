import { BrainCircuit } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <BrainCircuit className="h-7 w-7 text-primary" />
      <span className="text-2xl font-bold tracking-tighter">PintarAI</span>
    </div>
  );
}
