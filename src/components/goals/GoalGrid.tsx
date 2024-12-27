import React from "react";
import GoalCard from "./GoalCard";

interface Goal {
  id: string;
  title: string;
  progress: number;
  remainingDays: number;
  tasks: {
    id: string;
    text: string;
    completed: boolean;
  }[];
}

interface GoalGridProps {
  goals: Goal[];
  onGoalUpdate?: (goal: Goal) => void;
  onGoalDelete?: (goalId: string) => void;
}

const GoalGrid = ({ goals, onGoalUpdate, onGoalDelete }: GoalGridProps) => {
  const handleTaskToggle = (
    goalId: string,
    taskId: string,
    completed: boolean,
  ) => {
    const goal = goals.find((g) => g.id === goalId);
    if (goal) {
      const updatedTasks = goal.tasks.map((task) =>
        task.id === taskId ? { ...task, completed } : task,
      );
      const completedTasks = updatedTasks.filter((t) => t.completed).length;
      const progress = Math.round((completedTasks / updatedTasks.length) * 100);
      const updatedGoal = { ...goal, tasks: updatedTasks, progress };
      onGoalUpdate?.(updatedGoal);
    }
  };

  return (
    <div className="w-full bg-[#121212] px-2 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {goals.map((goal) => (
            <div key={goal.id} className="flex justify-center">
              <GoalCard
                title={goal.title}
                progress={goal.progress}
                remainingDays={goal.remainingDays}
                tasks={goal.tasks}
                onTaskToggle={(taskId, completed) =>
                  handleTaskToggle(goal.id, taskId, completed)
                }
                onDelete={() => onGoalDelete?.(goal.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalGrid;
