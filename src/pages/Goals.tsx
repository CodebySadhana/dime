import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BottomNav from "@/components/BottomNav";
import { Target, Plus, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const goalSchema = z.object({
  name: z.string().min(1).max(100),
  target_amount: z.string().min(1).transform((val) => parseFloat(val)),
  emoji: z.string().optional(),
});

const Goals = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [contributeAmount, setContributeAmount] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await (supabase as any)
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error: any) {
      console.error("Error loading goals:", error);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = goalSchema.parse({
        name,
        target_amount: targetAmount,
        emoji,
      });

      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase as any)
        .from("savings_goals")
        .insert({
          user_id: user.id,
          name: validated.name,
          target_amount: validated.target_amount,
          emoji: validated.emoji || "🎯",
          current_amount: 0,
        });

      if (error) throw error;

      toast({ title: "Success", description: "Goal created successfully!" });
      setName("");
      setTargetAmount("");
      setEmoji("🎯");
      setOpen(false);
      loadGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create goal",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const amount = parseFloat(contributeAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      setLoading(true);
      const newAmount = Number(selectedGoal.current_amount) + amount;

      const { error } = await (supabase as any)
        .from("savings_goals")
        .update({ current_amount: newAmount })
        .eq("id", selectedGoal.id);

      if (error) throw error;

      toast({ title: "Success", description: `Added ₹${amount.toLocaleString()} to ${selectedGoal.name}!` });
      setContributeAmount("");
      setContributeOpen(false);
      setSelectedGoal(null);
      loadGoals();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add contribution",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalTarget = goals.reduce((sum, goal) => sum + Number(goal.target_amount), 0);
  const totalCurrent = goals.reduce((sum, goal) => sum + Number(goal.current_amount), 0);
  const overallProgress = totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold cosmic-text mb-1">Savings Goals</h1>
            <p className="text-muted-foreground">Track your financial targets</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Create New Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emoji">Emoji</Label>
                  <Input
                    id="emoji"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="🎯"
                    maxLength={2}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Emergency Fund"
                    required
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target">Target Amount (₹)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    placeholder="50000"
                    required
                    className="bg-background/50"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary"
                >
                  {loading ? "Creating..." : "Create Goal"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Overview Card */}
        {goals.length > 0 && (
          <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white glow-card">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8" />
              <div>
                <p className="text-sm opacity-90">Total Progress</p>
                <h3 className="text-2xl font-bold">
                  ₹{totalCurrent.toLocaleString()} / ₹{totalTarget.toLocaleString()}
                </h3>
              </div>
            </div>
            <Progress value={overallProgress} className="h-2 bg-white/20" />
            <p className="text-sm mt-2 opacity-90">{Math.round(overallProgress)}% of all goals achieved</p>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
            return (
              <Card
                key={goal.id}
                className="p-5 bg-card/80 backdrop-blur-lg border-border glow-card hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{goal.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        ₹{Number(goal.current_amount).toLocaleString()} / ₹
                        {Number(goal.target_amount).toLocaleString()}
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
                    ₹{(Number(goal.target_amount) - Number(goal.current_amount)).toLocaleString()} to go
                  </span>
                </div>

                <Button
                  onClick={() => {
                    setSelectedGoal(goal);
                    setContributeOpen(true);
                  }}
                  className="w-full mt-3 bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  Add Money
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Contribute Dialog */}
        <Dialog open={contributeOpen} onOpenChange={setContributeOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>
                Add Money to {selectedGoal?.name} {selectedGoal?.emoji}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleContribute} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contribute-amount">Amount (₹)</Label>
                <Input
                  id="contribute-amount"
                  type="number"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  placeholder="1000"
                  required
                  min="0.01"
                  step="0.01"
                  className="bg-background/50"
                />
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Current: ₹{Number(selectedGoal?.current_amount || 0).toLocaleString()}</p>
                <p>Target: ₹{Number(selectedGoal?.target_amount || 0).toLocaleString()}</p>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary"
              >
                {loading ? "Adding..." : "Add Contribution"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add Goal CTA */}
        {goals.length === 0 && (
          <Card className="p-6 bg-accent/10 border-accent/20 text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold mb-2">Create Your First Goal</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Set a savings target and start building your future
            </p>
            <Button onClick={() => setOpen(true)} className="bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Add New Goal
            </Button>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Goals;