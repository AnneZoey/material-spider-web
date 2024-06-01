import { Progress } from "@/components/ui/progress";

interface HorizontalBarDataProps {
  label: string;
  value: number;
}

export const HorizontalBarData = ({ label, value }: HorizontalBarDataProps) => {
  return (
    <div>
      <h2 className=" font-semibold text-sm mb-1">{label}</h2>
      <Progress value={value * 10} className="h-3" />
    </div>
  );
};
