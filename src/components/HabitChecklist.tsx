import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DailyEntry } from "@/types/habits";
import { Moon, Dumbbell, Brain, Utensils, Code, BookOpen, GraduationCap, Sunrise, Shield } from "lucide-react";

interface HabitChecklistProps {
  entry: DailyEntry;
  onUpdate: (updates: Partial<DailyEntry>) => void;
  isEditable: boolean;
}

interface HabitItemProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
  numericInput?: {
    value: number;
    onChange: (value: number) => void;
    placeholder: string;
    min?: number;
    max?: number;
    step?: number;
  };
}

const HabitItem = ({ icon, label, checked, onChange, disabled, numericInput }: HabitItemProps) => (
  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
    <div className="flex items-center gap-3">
      <Checkbox 
        checked={checked} 
        onCheckedChange={onChange}
        disabled={disabled}
        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
      <span className="text-muted-foreground">{icon}</span>
      <Label className="text-foreground cursor-pointer">{label}</Label>
    </div>
    {numericInput && (
      <Input
        type="number"
        value={numericInput.value || ''}
        onChange={(e) => numericInput.onChange(parseFloat(e.target.value) || 0)}
        placeholder={numericInput.placeholder}
        disabled={disabled}
        min={numericInput.min}
        max={numericInput.max}
        step={numericInput.step}
        className="w-20 h-8 text-center bg-background border-border"
      />
    )}
  </div>
);

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ title, icon, children }: SectionProps) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <h3 className="text-sm font-medium uppercase tracking-wider">{title}</h3>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

const HabitChecklist = ({ entry, onUpdate, isEditable }: HabitChecklistProps) => {
  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border border-border">
      <h2 className="text-xl font-semibold text-foreground">Daily Habits</h2>
      
      <div className="space-y-6">
        {/* Sleep */}
        <Section title="Sleep" icon={<Moon size={16} />}>
          <HabitItem
            icon={<Moon size={18} />}
            label="Slept 6-7 hours"
            checked={entry.sleepHours >= 6 && entry.sleepHours <= 7}
            onChange={() => {}}
            disabled={true}
            numericInput={{
              value: entry.sleepHours,
              onChange: (value) => onUpdate({ sleepHours: value }),
              placeholder: "hrs",
              min: 0,
              max: 24,
              step: 0.5,
            }}
          />
        </Section>

        {/* Exercise & Meditation */}
        <Section title="Exercise & Meditation" icon={<Dumbbell size={16} />}>
          <HabitItem
            icon={<Dumbbell size={18} />}
            label="Exercised 45-50 minutes"
            checked={entry.exercised}
            onChange={(checked) => onUpdate({ exercised: checked as boolean })}
            disabled={!isEditable}
          />
          <HabitItem
            icon={<Brain size={18} />}
            label="Meditated at least 10 minutes"
            checked={entry.meditated}
            onChange={(checked) => onUpdate({ meditated: checked as boolean })}
            disabled={!isEditable}
          />
        </Section>

        {/* Nutrition */}
        <Section title="Nutrition" icon={<Utensils size={16} />}>
          <HabitItem
            icon={<Utensils size={18} />}
            label="Breakfast eaten"
            checked={entry.breakfast}
            onChange={(checked) => onUpdate({ breakfast: checked as boolean })}
            disabled={!isEditable}
          />
          <HabitItem
            icon={<Utensils size={18} />}
            label="Lunch eaten"
            checked={entry.lunch}
            onChange={(checked) => onUpdate({ lunch: checked as boolean })}
            disabled={!isEditable}
          />
          <HabitItem
            icon={<Utensils size={18} />}
            label="Dinner eaten"
            checked={entry.dinner}
            onChange={(checked) => onUpdate({ dinner: checked as boolean })}
            disabled={!isEditable}
          />
        </Section>

        {/* Problem Solving */}
        <Section title="Problem Solving" icon={<Code size={16} />}>
          <HabitItem
            icon={<Code size={18} />}
            label="Practiced problem solving"
            checked={entry.problemsSolved > 0}
            onChange={() => {}}
            disabled={true}
            numericInput={{
              value: entry.problemsSolved,
              onChange: (value) => onUpdate({ problemsSolved: value }),
              placeholder: "#",
              min: 0,
              max: 50,
              step: 1,
            }}
          />
        </Section>

        {/* Personal Growth Study */}
        <Section title="Personal Growth" icon={<BookOpen size={16} />}>
          <HabitItem
            icon={<BookOpen size={18} />}
            label="Studied for personal growth"
            checked={entry.studyHours >= 2}
            onChange={() => {}}
            disabled={true}
            numericInput={{
              value: entry.studyHours,
              onChange: (value) => onUpdate({ studyHours: value }),
              placeholder: "hrs",
              min: 0,
              max: 12,
              step: 0.5,
            }}
          />
        </Section>

        {/* University */}
        <Section title="University Academics" icon={<GraduationCap size={16} />}>
          <HabitItem
            icon={<GraduationCap size={18} />}
            label="Attended & listened carefully"
            checked={entry.universityAttended}
            onChange={(checked) => onUpdate({ universityAttended: checked as boolean })}
            disabled={!isEditable}
          />
          <HabitItem
            icon={<BookOpen size={18} />}
            label="Revised university classes"
            checked={entry.universityRevised}
            onChange={(checked) => onUpdate({ universityRevised: checked as boolean })}
            disabled={!isEditable}
          />
        </Section>

        {/* Spiritual */}
        <Section title="Spiritual Practice" icon={<Sunrise size={16} />}>
          <HabitItem
            icon={<Sunrise size={18} />}
            label="Morning fresh-up done"
            checked={entry.morningFreshUp}
            onChange={(checked) => onUpdate({ morningFreshUp: checked as boolean })}
            disabled={!isEditable}
          />
          <HabitItem
            icon={<Sunrise size={18} />}
            label="Mantras / spiritual study done"
            checked={entry.spiritualPractice}
            onChange={(checked) => onUpdate({ spiritualPractice: checked as boolean })}
            disabled={!isEditable}
          />
        </Section>

        {/* Discipline */}
        <Section title="Discipline & Character" icon={<Shield size={16} />}>
          <HabitItem
            icon={<Shield size={18} />}
            label="Acted with discipline and self-control today"
            checked={entry.disciplineCheck}
            onChange={(checked) => onUpdate({ disciplineCheck: checked as boolean })}
            disabled={!isEditable}
          />
        </Section>
      </div>
    </div>
  );
};

export default HabitChecklist;
