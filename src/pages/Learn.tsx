import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { BookOpen, Award, Flame, Play, CheckCircle2 } from "lucide-react";

const quizzes = [
  {
    title: "Budgeting 101: Your First Steps",
    description:
      "Understand the basics of creating and sticking to a personal budget.",
    difficulty: "Beginner",
    questions: 10,
    points: 100,
  },
  {
    title: "Financial IQ Challenge",
    description:
      "Test your knowledge on key financial concepts like interest rates and savings.",
    difficulty: "Intermediate",
    questions: 15,
    points: 150,
  },
  {
    title: "Investing Fundamentals",
    description:
      "An introductory guide to the world of investments and growing your wealth.",
    difficulty: "Advanced",
    questions: 20,
    points: 200,
  },
];

const Learn = () => {
  const [streak, setStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(850);

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold cosmic-text mb-1">Literacy Hub</h1>
          <p className="text-muted-foreground">
            Learn and earn while building financial skills
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-accent to-primary text-white glow-card">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">Streak</span>
            </div>
            <p className="text-3xl font-bold">{streak} days</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-secondary to-accent text-white glow-card">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Points</span>
            </div>
            <p className="text-3xl font-bold">{totalPoints}</p>
          </Card>
        </div>

        {/* Daily Challenge */}
        <Card className="p-6 bg-card/80 backdrop-blur-lg border-border glow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Flame className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Daily Challenge</h3>
              <p className="text-sm text-muted-foreground">
                Complete today's quiz to maintain your streak
              </p>
            </div>
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <Progress value={100} className="h-2 mb-3" />
          <p className="text-sm text-success font-medium">
            ✓ Completed for today!
          </p>
        </Card>

        {/* Quizzes */}
        <div className="space-y-3">
          <h3 className="font-semibold">Available Quizzes</h3>
          {quizzes.map((quiz, index) => (
            <Card
              key={index}
              className="p-5 bg-card/80 backdrop-blur-lg border-border glow-card hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{quiz.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {quiz.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{quiz.questions} questions</span>
                    <span>•</span>
                    <span className="text-primary font-medium">
                      +{quiz.points} points
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 mt-3">
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>

        {/* Progress Section */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <h3 className="font-semibold mb-4">Your Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Budgeting Mastery</span>
                <span className="text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Investment Knowledge</span>
                <span className="text-muted-foreground">40%</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Savings Strategy</span>
                <span className="text-muted-foreground">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Learn;
