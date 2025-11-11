import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import dimeLogo from "@/assets/dime-logo.png";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement authentication
    console.log("Auth:", { email, password, isLogin });
  };

  return (
    <div className="min-h-screen cosmic-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-card/80 backdrop-blur-lg border-border glow-card">
        <div className="flex flex-col items-center mb-8">
          <img src={dimeLogo} alt="DIME" className="w-48 mb-4" />
          <p className="text-muted-foreground text-center">
            Decode your Money, Design your Future
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background/50"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Auth;
