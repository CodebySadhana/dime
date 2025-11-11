import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { Target, Plus, TrendingUp } from "lucide-react";

const goals = [
  {
    name: "Dream Home Down Payment",
    current: 12500,
    target: 50000,
    emoji: "🏠",
  },
  {
    name: "New Tech Gadget",
    current: 600,
    target: 1200,
    emoji: "💻",
  },
  {
    name: "Vacation Fund",
    current: 800,
    target: 2500,
    emoji: "✈️",
  },
  {
    name: "Emergency Fund",
    current: 30000,
    target: 50000,
    emoji: "🛡️",
  },
];

const Goals = () => {
  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold cosmic-text mb-1">Savings Goals</h1>
            <p className="text-muted-foreground">Track your financial targets</p>
          </div>
          <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12">
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Overview Card */}
        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white glow-card">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Total Progress</p>
              <h3 className="text-2xl font-bold">43,900 / 103,700</h3>
            </div>
          </div>
          <Progress value={42} className="h-2 bg-white/20" />
          <p className="text-sm mt-2 opacity-90">42% of all goals achieved</p>
        </Card>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <Card
                key={index}
                className="p-5 bg-card/80 backdrop-blur-lg border-border glow-card hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{goal.current.toLocaleString()} / ₹
                        {goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>

                <Progress value={progress} className="h-2 mb-3" />

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    ₹{(goal.target - goal.current).toLocaleString()} to go
                  </span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Add Goal CTA */}
        <Card className="p-6 bg-accent/10 border-accent/20 text-center">
          <Target className="w-12 h-12 mx-auto mb-3 text-accent" />
          <h3 className="font-semibold mb-2">Create Your Next Goal</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Set a new savings target and start building your future
          </p>
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="w-4 h-4 mr-2" />
            Add New Goal
          </Button>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Goals;
