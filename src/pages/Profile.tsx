import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BottomNav from "@/components/BottomNav";
import {
  User,
  Mail,
  Phone,
  Award,
  Flame,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold cosmic-text mb-1">Profile</h1>
          <p className="text-muted-foreground">Manage your account</p>
        </div>

        {/* Profile Header */}
        <Card className="p-6 bg-gradient-to-br from-primary to-secondary text-white glow-card">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Rahul Kumar</h2>
              <p className="text-sm opacity-90">Member since Jan 2025</p>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-card/80 backdrop-blur-lg border-border text-center">
            <Flame className="w-6 h-6 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">7</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </Card>
          <Card className="p-4 bg-card/80 backdrop-blur-lg border-border text-center">
            <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">850</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </Card>
          <Card className="p-4 bg-card/80 backdrop-blur-lg border-border text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Quizzes Done</p>
          </Card>
        </div>

        {/* Account Details */}
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-border space-y-4">
          <h3 className="font-semibold mb-4">Account Details</h3>
          
          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">rahul.kumar@email.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">+91 98765 43210</p>
            </div>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-border">
          <h3 className="font-semibold mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {[
              { title: "7 Day Streak Master", emoji: "🔥", date: "Today" },
              { title: "Quiz Champion", emoji: "🏆", date: "2 days ago" },
              { title: "Smart Saver", emoji: "💰", date: "1 week ago" },
            ].map((achievement, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
              >
                <span className="text-3xl">{achievement.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {achievement.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 bg-card/80 backdrop-blur-lg border-border hover:bg-card"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-12 bg-destructive/10 border-destructive/20 hover:bg-destructive/20 text-destructive"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
