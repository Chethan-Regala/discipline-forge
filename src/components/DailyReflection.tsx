import { Textarea } from "@/components/ui/textarea";
import { PenLine } from "lucide-react";

interface DailyReflectionProps {
  value: string;
  onChange: (value: string) => void;
  isEditable: boolean;
}

const DailyReflection = ({ value, onChange, isEditable }: DailyReflectionProps) => {
  return (
    <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-4">
        <PenLine size={18} className="text-muted-foreground flex-shrink-0" />
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">End-of-Day Reflection</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs sm:text-sm text-muted-foreground block mb-2">
            What did I do right today? What must improve tomorrow?
          </label>
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={!isEditable}
            placeholder="Reflect honestly on your day..."
            className="min-h-[120px] bg-background border-border resize-none text-sm sm:text-base"
          />
        </div>
      </div>
      
      {!isEditable && (
        <p className="text-xs text-muted-foreground mt-3 italic">
          Past entries are read-only
        </p>
      )}
    </div>
  );
};

export default DailyReflection;
