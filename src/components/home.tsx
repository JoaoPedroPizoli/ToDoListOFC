import React, { useState, useEffect } from "react";
import GoalGrid from "./goals/GoalGrid";
import { Button } from "@/components/ui/button";
import { Plus, X, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  lastCompletedDate?: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  remainingDays: number;
  endDate: string;
  tasks: Task[];
}

interface HomeProps {
  title?: string;
}

const defaultGoals: Goal[] = [
  {
    id: "1",
    title: "Fitness Goal",
    progress: 65,
    remainingDays: 14,
    endDate: "2024-02-14",
    tasks: [
      { id: "1", text: "Morning workout", completed: true },
      { id: "2", text: "Evening run", completed: false },
      { id: "3", text: "Healthy meal prep", completed: true },
    ],
  },
  {
    id: "2",
    title: "Reading Goal",
    progress: 40,
    remainingDays: 21,
    endDate: "2024-02-21",
    tasks: [
      { id: "1", text: "Read 30 pages", completed: false },
      { id: "2", text: "Take notes", completed: true },
      { id: "3", text: "Review chapter", completed: false },
    ],
  },
];

const Home = ({ title = "Goal Tracking Dashboard" }: HomeProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newTasks, setNewTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      const brasiliaTime = new Date(
        now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }),
      );

      if (brasiliaTime.getHours() === 0 && brasiliaTime.getMinutes() === 0) {
        setGoals((prevGoals) =>
          prevGoals.map((goal) => ({
            ...goal,
            tasks: goal.tasks.map((task) => ({
              ...task,
              completed: false,
              lastCompletedDate: undefined,
            })),
          })),
        );
      }
    };

    const timer = setInterval(checkMidnight, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText,
        completed: false,
      };
      setNewTasks((prev) => [...prev, newTask]);
      setNewTaskText("");
    }
  };

  const handleRemoveTask = (taskId: string) => {
    setNewTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoalTitle.trim() && newTasks.length > 0 && endDate) {
      const endDateTime = new Date(endDate);
      const today = new Date();
      const remainingDays = Math.ceil(
        (endDateTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      const newGoal: Goal = {
        id: Date.now().toString(),
        title: newGoalTitle,
        progress: 0,
        remainingDays,
        endDate,
        tasks: newTasks,
      };
      setGoals((prevGoals) => [...prevGoals, newGoal]);
      setNewGoalTitle("");
      setNewTasks([]);
      setEndDate("");
      setIsDialogOpen(false);
    }
  };

  const handleGoalUpdate = (updatedGoal: Goal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal,
      ),
    );
  };

  const handleGoalDelete = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 mb-8">
          <div className="w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
              <div className="flex items-center gap-2 bg-[#2A2A2A] px-3 py-1.5 rounded-full">
                <Calendar size={14} className="text-[#7C4DFF]" />
                <span className="text-xs sm:text-sm text-gray-300">
                  {format(currentDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Track your progress and achieve your goals
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#7C4DFF] hover:bg-[#6B42E0] text-white w-full sm:w-auto"
                size="lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1E1E1E] text-white border-[#2A2A2A] w-[95%] max-w-lg mx-auto">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goalTitle">Goal Title</Label>
                  <Input
                    id="goalTitle"
                    value={newGoalTitle}
                    onChange={(e) => setNewGoalTitle(e.target.value)}
                    placeholder="Enter goal title"
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={format(new Date(), "yyyy-MM-dd")}
                    className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Daily Tasks</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={newTaskText}
                        onChange={(e) => setNewTaskText(e.target.value)}
                        placeholder="Enter task"
                        className="bg-[#2A2A2A] border-[#3A3A3A] text-white flex-1"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTask();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        onClick={handleAddTask}
                        variant="ghost"
                        className="text-white hover:bg-[#3A3A3A] px-3 whitespace-nowrap"
                      >
                        Add
                      </Button>
                    </div>

                    <ScrollArea className="h-[200px] rounded-md border border-[#3A3A3A] p-2">
                      <div className="space-y-2">
                        {newTasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between bg-[#2A2A2A] p-2 rounded"
                          >
                            <span className="text-sm text-gray-300 break-all pr-2">
                              {task.text}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTask(task.id)}
                              className="text-gray-400 hover:text-white shrink-0"
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#7C4DFF] hover:bg-[#6B42E0] text-white"
                  disabled={
                    !newGoalTitle.trim() || newTasks.length === 0 || !endDate
                  }
                >
                  Create Goal
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <GoalGrid
          goals={goals}
          onGoalUpdate={handleGoalUpdate}
          onGoalDelete={handleGoalDelete}
        />
      </div>
    </div>
  );
};

export default Home;
