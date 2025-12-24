import { getScoreMessage } from "@/types/habits";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface DisciplineScoreProps {
  score: number;
  previousScore?: number;
}

const DisciplineScore = ({ score, previousScore }: DisciplineScoreProps) => {
  const message = getScoreMessage(score);
  const trend = previousScore !== undefined ? score - previousScore : 0;

  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-warning";
    return "text-muted-foreground";
  };

  const getProgressColor = () => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-primary";
    if (score >= 40) return "bg-warning";
    return "bg-muted";
  };

  return (
    <div className="p-4 sm:p-6 bg-card rounded-xl border border-border">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Discipline Score</h2>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-xs sm:text-sm ${trend > 0 ? 'text-success' : 'text-destructive'}`}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
        {trend === 0 && previousScore !== undefined && (
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Minus size={16} />
            <span className="hidden sm:inline">Same as yesterday</span>
            <span className="sm:hidden">Same</span>
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-4 mb-4">
        <span className={`text-4xl sm:text-5xl font-bold ${getScoreColor()}`}>
          {score}%
        </span>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2 mb-4">
        <div 
          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${score}%` }}
        />
      </div>
      
      <p className="text-muted-foreground text-xs sm:text-sm italic">{message}</p>
    </div>
  );
};

export default DisciplineScore;
