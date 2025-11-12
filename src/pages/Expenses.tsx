import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BottomNav from "@/components/BottomNav";
import { ShoppingBag, Coffee, Car, Home, Zap, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const categories = [
  { value: "food", label: "Food", icon: Coffee },
  { value: "transport", label: "Transport", icon: Car },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "housing", label: "Housing", icon: Home },
  { value: "utilities", label: "Utilities", icon: Zap },
  { value: "entertainment", label: "Entertainment", icon: Heart },
];

const expenseSchema = z.object({
  amount: z.string().min(1).transform((val) => parseFloat(val)),
  category: z.string().min(1),
  description: z.string().max(200).optional(),
  expense_date: z.string().min(1),
});

const Expenses = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await (supabase as any)
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("expense_date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      console.error("Error loading expenses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = expenseSchema.parse({
        amount,
        category,
        description,
        expense_date: date,
      });

      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await (supabase as any)
        .from("expenses")
        .insert({
          user_id: user.id,
          amount: validated.amount,
          category: validated.category,
          description: validated.description || "",
          expense_date: validated.expense_date,
        });

      if (error) throw error;

      toast({ title: "Success", description: "Expense tracked successfully!" });
      setAmount("");
      setCategory("");
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      loadExpenses();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save expense",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold cosmic-text mb-1">Track Expense</h1>
          <p className="text-muted-foreground">Add a new expense entry</p>
        </div>

        <Card className="p-6 bg-card/80 backdrop-blur-lg border-border glow-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="text-2xl h-14 bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What did you spend on?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background/50"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity h-12"
            >
              {loading ? "Saving..." : "Save Expense"}
            </Button>
          </form>
        </Card>

        {/* Recent Expenses */}
        {expenses.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Recent Expenses</h3>
            <Card className="divide-y divide-border bg-card/80 backdrop-blur-lg border-border">
              {expenses.map((expense) => {
                const categoryInfo = categories.find(c => c.value === expense.category) || categories[0];
                const Icon = categoryInfo.icon;
                return (
                  <div key={expense.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{expense.description || expense.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {categoryInfo.label} • {new Date(expense.expense_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className="font-semibold">₹{Number(expense.amount).toLocaleString()}</span>
                  </div>
                );
              })}
            </Card>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Expenses;
