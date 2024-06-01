import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { useState } from "react";

interface NavigationButtonsProps {
  currentIndex: number;
  totalItems: number;
  increaseIndex: () => void;
  decreaseIndex: () => void;
  toFirstIndex: () => void;
  toLastIndex: () => void;
  setIndex: (index: number) => void;
}

export const NavigationButtons = ({
  currentIndex,
  totalItems,
  increaseIndex,
  decreaseIndex,
  toFirstIndex,
  toLastIndex,
  setIndex,
}: NavigationButtonsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentIndex + 1);

  const handleBlur = () => {
    setIsEditing(false);
    const newIndex = Math.max(1, Math.min(totalItems, Number(inputValue))) - 1;
    setIndex(newIndex);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div className="flex items-center justify-center mt-3 gap-3">
      <Button variant="outline" onClick={toFirstIndex} size="icon">
        <ChevronFirst className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={decreaseIndex} size="icon">
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {isEditing ? (
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(Number(e.target.value))}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          min={1}
          max={totalItems}
          className="w-20 text-center"
        />
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {currentIndex + 1} / {totalItems}
        </div>
      )}
      <Button variant="outline" onClick={increaseIndex} size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" onClick={toLastIndex} size="icon">
        <ChevronLast className="h-4 w-4" />
      </Button>
    </div>
  );
};
