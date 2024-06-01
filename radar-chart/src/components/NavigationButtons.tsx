import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";

export const NavigationButtons = ({
  currentIndex,
  totalItems,
  increaseIndex,
  decreaseIndex,
  toFirstIndex,
  toLastIndex,
}: {
  currentIndex: number;
  totalItems: number;
  increaseIndex: () => void;
  decreaseIndex: () => void;
  toFirstIndex: () => void;
  toLastIndex: () => void;
}) => {
  return (
    <div className="flex items-center justify-center mt-3 gap-3">
      <Button variant="outline" onClick={toFirstIndex} size="icon">
        <ChevronFirst className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={decreaseIndex} size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div>
        {currentIndex + 1} / {totalItems}
      </div>
      <Button variant="outline" onClick={increaseIndex} size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={toLastIndex} size="icon">
        <ChevronLast className="h-4 w-4" />
      </Button>
    </div>
  );
};
