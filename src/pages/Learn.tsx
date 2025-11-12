import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import BottomNav from "@/components/BottomNav";
import { BookOpen, Award, Flame, Play, CheckCircle2, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const topics = [
  {
    id: "budgeting",
    title: "Budgeting Basics",
    description: "Master the fundamentals of personal budgeting",
    difficulty: "Beginner",
    points: 100,
    content: `# Budgeting Basics

## What is Budgeting?
Budgeting is the process of creating a plan to spend your money. This spending plan helps you ensure you will always have enough money for the things you need and want.

## Why Budget?
- Control your spending
- Save for future goals
- Reduce financial stress
- Avoid debt
- Build wealth over time

## The 50/30/20 Rule
A simple budgeting method:
- 50% for Needs (housing, food, utilities)
- 30% for Wants (entertainment, dining out)
- 20% for Savings and debt repayment

## Creating Your First Budget
1. Calculate your monthly income
2. List all your expenses
3. Categorize needs vs wants
4. Set spending limits for each category
5. Track your spending regularly
6. Adjust as needed

## Common Budgeting Mistakes
- Not tracking small expenses
- Forgetting irregular expenses
- Being too restrictive
- Not reviewing and adjusting
- Giving up too soon

## Tips for Success
- Use budgeting apps
- Review weekly
- Build an emergency fund
- Plan for irregular expenses
- Celebrate small wins`,
  },
  {
    id: "savings",
    title: "Smart Saving Strategies",
    description: "Learn effective techniques to build your savings",
    difficulty: "Beginner",
    points: 100,
    content: `# Smart Saving Strategies

## Why Save Money?
Saving money provides financial security, helps achieve goals, and creates opportunities. It's the foundation of financial wellness.

## Types of Savings
1. **Emergency Fund**: 3-6 months of expenses
2. **Short-term Goals**: Vacations, gadgets (1-3 years)
3. **Long-term Goals**: House, retirement (5+ years)

## The Power of Compound Interest
Money saved today grows over time through interest earned on both principal and accumulated interest.

## Saving Methods

### Pay Yourself First
Automatically transfer money to savings before paying bills.

### The 24-Hour Rule
Wait 24 hours before making non-essential purchases.

### Round-Up Savings
Round up purchases to nearest ₹10 or ₹100 and save the difference.

### Challenge Yourself
- 52-week challenge: Save ₹10 week 1, ₹20 week 2, etc.
- No-spend days/weeks
- Spare change savings

## Where to Keep Savings
- High-yield savings accounts
- Fixed deposits
- Recurring deposits
- Liquid mutual funds

## Common Saving Mistakes
- No clear goals
- Not automating savings
- Keeping all money in low-interest accounts
- Dipping into savings frequently
- Not increasing savings with income

## Tips for Success
- Set specific goals
- Automate transfers
- Track progress
- Reduce unnecessary expenses
- Increase savings rate annually`,
  },
  {
    id: "investing",
    title: "Investment Fundamentals",
    description: "Introduction to growing wealth through investments",
    difficulty: "Intermediate",
    points: 150,
    content: `# Investment Fundamentals

## What is Investing?
Investing is putting money to work to generate returns over time. Unlike saving, investing involves taking calculated risks for potentially higher rewards.

## Why Invest?
- Beat inflation
- Build wealth
- Achieve long-term goals
- Create passive income
- Financial independence

## Key Investment Concepts

### Risk vs Return
Higher potential returns usually come with higher risk. Understanding your risk tolerance is crucial.

### Diversification
Don't put all eggs in one basket. Spread investments across different asset classes.

### Time Horizon
Longer investment periods allow for recovery from market volatility.

## Investment Options in India

### Equity (Stocks)
- Direct stocks
- Equity mutual funds
- Index funds
- Potential for high returns

### Fixed Income
- Fixed deposits
- Bonds
- Debt mutual funds
- More stable, lower returns

### Real Estate
- Physical property
- REITs (Real Estate Investment Trusts)
- Requires significant capital

### Gold
- Physical gold
- Gold ETFs
- Sovereign Gold Bonds
- Hedge against inflation

## Getting Started

1. **Build Emergency Fund First**
   Save 6 months of expenses before investing.

2. **Define Your Goals**
   - Retirement
   - Children's education
   - House purchase

3. **Know Your Risk Appetite**
   Conservative, moderate, or aggressive

4. **Start Small**
   Begin with SIPs (Systematic Investment Plans)

5. **Learn Continuously**
   Read, research, and stay informed

## Common Investment Mistakes
- Trying to time the market
- Lack of diversification
- Following tips blindly
- Emotional decision-making
- Not reviewing portfolio regularly

## Investment Tips
- Start early
- Invest regularly (SIP)
- Stay invested long-term
- Rebalance portfolio annually
- Don't panic during market dips`,
  },
];

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const Learn = () => {
  const [profile, setProfile] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await (supabase as any)
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
    }
  };

  const generateQuiz = async (topic: typeof topics[0]) => {
    setGeneratingQuiz(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { topic: topic.title, content: topic.content },
      });

      if (error) throw error;
      
      if (!data?.questions || data.questions.length === 0) {
        throw new Error("Failed to generate quiz questions");
      }

      setQuestions(data.questions);
      setShowQuiz(true);
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingQuiz(false);
    }
  };

  const handleStartQuiz = (topic: typeof topics[0]) => {
    setSelectedTopic(topic);
    setShowQuiz(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    generateQuiz(topic);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    try {
      const correctCount = selectedAnswers.filter(
        (answer, index) => answer === questions[index].correctAnswer
      ).length;
      
      const score = (correctCount / questions.length) * 100;
      const pointsEarned = selectedTopic ? Math.round((score / 100) * selectedTopic.points) : 0;

      // Update user profile with points
      const { data: { user } } = await supabase.auth.getUser();
      if (user && profile) {
        await (supabase as any)
          .from("profiles")
          .update({
            total_points: (profile.total_points || 0) + pointsEarned,
            streak_count: (profile.streak_count || 0) + 1,
          })
          .eq("id", user.id);
        
        await loadProfile();
      }

      setShowResults(true);
      toast({
        title: "Quiz Completed!",
        description: `You earned ${pointsEarned} points! Score: ${Math.round(score)}%`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit quiz",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setShowQuiz(false);
    setShowResults(false);
  };

  const correctCount = selectedAnswers.filter(
    (answer, index) => answer === questions[index]?.correctAnswer
  ).length;
  const score = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

  if (selectedTopic && !showQuiz && !generatingQuiz) {
    return (
      <div className="min-h-screen cosmic-bg pb-24">
        <div className="max-w-md mx-auto p-4 space-y-6">
          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={handleBackToTopics}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topics
            </Button>
            <h1 className="text-2xl font-bold cosmic-text mb-1">{selectedTopic.title}</h1>
            <p className="text-muted-foreground">{selectedTopic.description}</p>
          </div>

          <Card className="p-6 bg-card/80 backdrop-blur-lg border-border">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              {selectedTopic.content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) {
                  return <h1 key={i} className="text-2xl font-bold mb-4 cosmic-text">{line.slice(2)}</h1>;
                }
                if (line.startsWith('## ')) {
                  return <h2 key={i} className="text-xl font-semibold mb-3 mt-6">{line.slice(3)}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i} className="text-lg font-semibold mb-2 mt-4">{line.slice(4)}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={i} className="ml-6 mb-1">{line.slice(2)}</li>;
                }
                if (line.match(/^\d+\./)) {
                  return <li key={i} className="ml-6 mb-1">{line.slice(line.indexOf('.') + 1)}</li>;
                }
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i} className="font-semibold mb-2">{line.slice(2, -2)}</p>;
                }
                if (line.trim() === '') {
                  return <div key={i} className="h-2" />;
                }
                return <p key={i} className="mb-3 text-foreground">{line}</p>;
              })}
            </div>
          </Card>

          <Button
            onClick={() => generateQuiz(selectedTopic)}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Quiz
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (generatingQuiz) {
    return (
      <div className="min-h-screen cosmic-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Generating your quiz...</p>
        </div>
      </div>
    );
  }

  if (showQuiz && questions.length > 0) {
    if (showResults) {
      return (
        <div className="min-h-screen cosmic-bg pb-24">
          <div className="max-w-md mx-auto p-4 space-y-6">
            <div className="pt-4 text-center">
              <h1 className="text-2xl font-bold cosmic-text mb-2">Quiz Complete!</h1>
              <p className="text-muted-foreground">Great job finishing the quiz</p>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary to-secondary text-white glow-card text-center">
              <Award className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-4xl font-bold mb-2">{Math.round(score)}%</h2>
              <p className="text-lg mb-4">
                {correctCount} out of {questions.length} correct
              </p>
              <p className="text-sm opacity-90">
                +{selectedTopic ? Math.round((score / 100) * selectedTopic.points) : 0} points earned
              </p>
            </Card>

            <div className="space-y-4">
              {questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                  <Card key={index} className={`p-4 bg-card/80 backdrop-blur-lg border-2 ${isCorrect ? 'border-success' : 'border-destructive'}`}>
                    <p className="font-medium mb-3">{index + 1}. {q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => {
                        const isUserAnswer = userAnswer === optIndex;
                        const isCorrectAnswer = optIndex === q.correctAnswer;
                        return (
                          <div
                            key={optIndex}
                            className={`p-2 rounded ${
                              isCorrectAnswer
                                ? 'bg-success/20 text-success'
                                : isUserAnswer
                                ? 'bg-destructive/20 text-destructive'
                                : 'bg-background/50'
                            }`}
                          >
                            {isCorrectAnswer && '✓ '}
                            {isUserAnswer && !isCorrectAnswer && '✗ '}
                            {option}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>

            <Button
              onClick={handleBackToTopics}
              className="w-full bg-primary hover:bg-primary/90 h-12"
            >
              Back to Topics
            </Button>
          </div>
          <BottomNav />
        </div>
      );
    }

    const currentQ = questions[currentQuestion];
    return (
      <div className="min-h-screen cosmic-bg pb-24">
        <div className="max-w-md mx-auto p-4 space-y-6">
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-sm font-medium">
                {selectedTopic?.title}
              </p>
            </div>
            <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2 mb-4" />
          </div>

          <Card className="p-6 bg-card/80 backdrop-blur-lg border-border">
            <h2 className="text-xl font-semibold mb-6">{currentQ.question}</h2>
            <RadioGroup
              value={selectedAnswers[currentQuestion]?.toString()}
              onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </Card>

          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined || loading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12"
          >
            {loading ? "Submitting..." : currentQuestion < questions.length - 1 ? "Next Question" : "Submit Quiz"}
          </Button>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen cosmic-bg pb-24">
      <div className="max-w-md mx-auto p-4 space-y-6">
        <div className="pt-4">
          <h1 className="text-2xl font-bold cosmic-text mb-1">Financial Literacy Hub</h1>
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
            <p className="text-3xl font-bold">{profile?.streak_count || 0} days</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-secondary to-accent text-white glow-card">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5" />
              <span className="text-sm font-medium">Points</span>
            </div>
            <p className="text-3xl font-bold">{profile?.total_points || 0}</p>
          </Card>
        </div>

        {/* Topics */}
        <div className="space-y-3">
          <h3 className="font-semibold">Available Topics</h3>
          {topics.map((topic) => (
            <Card
              key={topic.id}
              className="p-5 bg-card/80 backdrop-blur-lg border-border glow-card hover:scale-[1.02] transition-transform cursor-pointer"
              onClick={() => handleStartQuiz(topic)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {topic.difficulty}
                    </span>
                  </div>
                  <h4 className="font-semibold mb-2">{topic.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {topic.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>10 questions</span>
                    <span>•</span>
                    <span className="text-primary font-medium">
                      +{topic.points} points
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 mt-3">
                <Play className="w-4 h-4 mr-2" />
                Start Learning
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Learn;