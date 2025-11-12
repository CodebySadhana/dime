import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Flame, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Load profile
      const { data: profileData } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      setProfile(profileData);

      // Load goals
      const { data: goalsData } = await (supabase as any)
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2);
      
      setGoals(goalsData || []);

      // Load recent expenses
      const { data: expensesData } = await (supabase as any)
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("expense_date", { ascending: false })
        .limit(3);
      
      setExpenses(expensesData || []);
    } catch (error: any) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold cosmic-text mb-1">
            Welcome Back{profile?.full_name ? `, ${profile.full_name}` : ""}!
          </h1>
          <p className="text-muted-foreground">Let's manage your finances</p>
        </div>

        {/* Daily Quiz Streak */}
        <Card className="p-4 bg-card/80 backdrop-blur-lg border-border glow-card hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate("/learn")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/20 rounded-full">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Financial Literacy Challenge</h3>
                <p className="text-sm text-muted-foreground">
                  {profile?.streak_count || 0} day streak 🔥 • {profile?.total_points || 0} points
                </p>
              </div>
            </div>
            <Button size="sm" className="bg-accent hover:bg-accent/90">
              Learn
            </Button>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => navigate("/expenses")}
            className="h-20 bg-card hover:bg-card/80 text-foreground border border-border flex flex-col gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">Add Expense</span>
          </Button>
          <Button
            onClick={() => navigate("/goals")}
            className="h-20 bg-card hover:bg-card/80 text-foreground border border-border flex flex-col gap-2"
          >
            <ArrowUpRight className="w-5 h-5" />
            <span className="text-sm">View Goals</span>
          </Button>
        </div>

        {/* Savings Goals Progress */}
        {goals.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Active Goals</h3>
            <Card className="p-4 bg-card/80 backdrop-blur-lg border-border space-y-3">
              {goals.map((goal) => {
                const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{goal.emoji}</span>
                        <span>{goal.name}</span>
                      </span>
                      <span className="text-muted-foreground">
                        ₹{Number(goal.current_amount).toLocaleString()} / ₹{Number(goal.target_amount).toLocaleString()}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* Recent Activity */}
        {expenses.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Expenses</h3>
            <Card className="divide-y divide-border bg-card/80 backdrop-blur-lg border-border">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{expense.description || expense.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {expense.category} • {new Date(expense.expense_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                    <span className="text-destructive">
                      ₹{Number(expense.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
