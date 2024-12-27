import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Clock, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface GoalCardProps {
  title?: string;
  progress?: number;
  remainingDays?: number;
  tasks?: Task[];
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  onDelete?: () => void;
}

const defaultTasks: Task[] = [
  { id: "1", text: "Complete daily exercise", completed: false },
  { id: "2", text: "Read for 30 minutes", completed: true },
  { id: "3", text: "Practice meditation", completed: false },
];

const GoalCard = ({
  title = "Fitness Goal",
  progress = 65,
  remainingDays = 14,
  tasks = defaultTasks,
  onTaskToggle,
  onDelete,
}: GoalCardProps) => {
  const handleCheckboxChange = (taskId: string, checked: boolean) => {
    onTaskToggle?.(taskId, checked);
  };

  return (
    <Card className="w-full max-w-[420px] h-[380px] bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#7C4DFF] transition-all duration-300 transform hover:-translate-y-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg sm:text-xl font-semibold text-white truncate pr-2">
              {title}
            </h3>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <div className="flex items-center text-gray-400 gap-1 sm:gap-2">
                <Clock size={16} />
                <span className="text-xs sm:text-sm whitespace-nowrap">
                  {remainingDays} days left
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-gray-400 hover:text-red-500 hover:bg-red-500/10 -mr-2"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm text-gray-400">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2 bg-[#2A2A2A]"
              indicatorClassName="bg-[#7C4DFF]"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-white font-medium text-sm sm:text-base">
                Daily Tasks
              </h4>
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-400">
                <CheckCircle size={14} />
                <span>
                  {tasks.filter((t) => t.completed).length}/{tasks.length}
                </span>
              </div>
            </div>
            <ScrollArea className="h-[180px]">
              <div className="space-y-3 pr-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={task.id}
                      checked={task.completed}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(task.id, checked as boolean)
                      }
                      className="mt-0.5 border-gray-600 data-[state=checked]:bg-[#7C4DFF] data-[state=checked]:border-[#7C4DFF]"
                    />
                    <Label
                      htmlFor={task.id}
                      className={`text-xs sm:text-sm break-words ${task.completed ? "text-gray-500 line-through" : "text-gray-300"}`}
                    >
                      {task.text}
                    </Label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
