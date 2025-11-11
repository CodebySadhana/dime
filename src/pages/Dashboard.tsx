import { ArrowUpRight, ArrowDownRight, Flame, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="pt-4">
          <h1 className="text-2xl font-bold cosmic-text mb-1">Welcome Back!</h1>
          <p className="text-muted-foreground">Let's manage your finances</p>
        </div>

        {/* Balance Card */}
        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white glow-card">
          <p className="text-sm opacity-90 mb-2">Total Balance</p>
          <h2 className="text-4xl font-bold mb-3">₹12,345.67</h2>
          <div className="flex items-center gap-2 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+₹123.45 this month</span>
          </div>
        </Card>

        {/* Daily Quiz Streak */}
        <Card className="p-4 bg-card/80 backdrop-blur-lg border-border glow-card hover:scale-[1.02] transition-transform cursor-pointer" onClick={() => navigate("/learn")}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/20 rounded-full">
                <Flame className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">Daily Quiz Challenge</h3>
                <p className="text-sm text-muted-foreground">7 day streak 🔥</p>
              </div>
            </div>
            <Button size="sm" className="bg-accent hover:bg-accent/90">
              Start
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
        <div className="space-y-3">
          <h3 className="font-semibold">Active Goals</h3>
          <Card className="p-4 bg-card/80 backdrop-blur-lg border-border space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>New Laptop</span>
                <span className="text-muted-foreground">₹15,000 / ₹50,000</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Emergency Fund</span>
                <span className="text-muted-foreground">₹30,000 / ₹50,000</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h3 className="font-semibold">Recent Activity</h3>
          <Card className="divide-y divide-border bg-card/80 backdrop-blur-lg border-border">
            {[
              {
                name: "Grocery Shopping",
                amount: -1250,
                category: "Food",
                date: "Today",
              },
              {
                name: "Salary Deposit",
                amount: 45000,
                category: "Income",
                date: "Yesterday",
              },
              {
                name: "Movie Tickets",
                amount: -600,
                category: "Entertainment",
                date: "2 days ago",
              },
            ].map((transaction, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{transaction.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {transaction.category} • {transaction.date}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {transaction.amount > 0 ? (
                    <ArrowUpRight className="w-4 h-4 text-success" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-destructive" />
                  )}
                  <span
                    className={
                      transaction.amount > 0 ? "text-success" : "text-destructive"
                    }
                  >
                    ₹{Math.abs(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
