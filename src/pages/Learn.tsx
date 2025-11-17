import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import BottomNav from "@/components/BottomNav";
import { BookOpen, Award, Flame, Play, CheckCircle2, ArrowLeft, GraduationCap, Clock, TrendingUp, Sparkles, Target } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const topics = [
  {
    id: "budgeting",
    title: "Budgeting Basics",
    description: "Master the fundamentals of personal budgeting",
    difficulty: "Beginner",
    points: 100,
    emoji: "💰",
    content: `Budgeting is your financial foundation. It's not about restricting yourself—it's about making informed choices and having control over your money.

**The 50/30/20 Rule**: Allocate 50% of income to needs (rent, food, utilities), 30% to wants (entertainment, dining), and 20% to savings and debt repayment. This simple framework helps balance present enjoyment with future security.

**Creating Your Budget**: Start by tracking all income and expenses for a month. Categorize spending, identify patterns, and set realistic limits. Use apps or spreadsheets—whatever works for you.

**Common Pitfalls**: Many people forget irregular expenses like car maintenance or annual subscriptions. Build a buffer for these. Also, don't be too strict; allow some flexibility or you'll abandon the budget.

**Success Tips**: Review weekly, celebrate progress, and adjust as needed. Budgeting is a skill that improves with practice.`,
  },
  {
    id: "savings",
    title: "Emergency Fund",
    description: "Build your financial safety net",
    difficulty: "Beginner",
    points: 100,
    emoji: "🛟",
    content: `An emergency fund is your financial cushion for unexpected events—job loss, medical emergencies, or urgent repairs. It prevents you from going into debt when life throws curveballs.

**How Much to Save**: Aim for 3-6 months of living expenses. If you have unstable income or dependents, target 6-12 months. Start with ₹10,000 as an initial milestone, then build up.

**Where to Keep It**: Use a high-yield savings account or liquid fund—accessible but separate from daily spending. You want quick access without investment risk.

**Building Your Fund**: Set up automatic transfers after each paycheck. Even ₹500/month adds up. Cut one unnecessary subscription and redirect that money here.

**When to Use It**: Only for genuine emergencies—not sales or vacations. Once used, prioritize replenishing it before other financial goals.`,
  },
  {
    id: "investing",
    title: "Investment Fundamentals",
    description: "Start your wealth-building journey",
    difficulty: "Intermediate",
    points: 150,
    emoji: "📈",
    content: `Investing is putting money to work to generate returns over time. While saving preserves money, investing grows it—crucial for beating inflation and building wealth.

**Key Concepts**: Risk and return are linked—higher potential returns come with higher risk. Diversification spreads risk across different assets. Time is your biggest ally; longer periods smooth out volatility.

**Getting Started**: First, build an emergency fund. Then define goals (retirement, home, education) with timelines. Longer timelines allow more risk-taking for higher returns.

**Asset Classes**: Equity (stocks/mutual funds) offers high growth potential. Debt (bonds/FDs) provides stability and regular income. Gold hedges inflation. Real estate builds long-term wealth.

**Starting Tips**: Begin with SIPs (Systematic Investment Plans) in index funds—low-cost, diversified, and beginner-friendly. Invest ₹1,000/month to start. Increase as income grows.

**Common Mistakes**: Don't try to time the market or follow tips blindly. Avoid checking prices daily—stay focused on long-term goals.`,
  },
  {
    id: "mutual-funds",
    title: "Mutual Funds Explained",
    description: "Understand pooled investment vehicles",
    difficulty: "Intermediate",
    points: 150,
    emoji: "🏦",
    content: `Mutual funds pool money from multiple investors to invest in diversified portfolios managed by professionals. They're ideal for beginners lacking time or expertise.

**Types of Mutual Funds**: Equity funds invest in stocks for growth. Debt funds invest in bonds for stability. Hybrid funds balance both. Index funds track market indices with minimal fees.

**How They Work**: You buy units at Net Asset Value (NAV). Fund managers invest in various securities. Returns come from capital appreciation, dividends, or interest.

**SIP vs Lumpsum**: Systematic Investment Plans (SIPs) invest fixed amounts monthly, averaging costs over time—perfect for salaried individuals. Lumpsum is one-time investment, best when you have spare capital.

**Choosing Funds**: Check past performance (5+ years), expense ratios (lower is better), and fund manager experience. Match fund risk with your goals—equity for long-term, debt for short-term.

**Tax Benefits**: ELSS (Equity Linked Savings Scheme) offers tax deductions under Section 80C with 3-year lock-in. Long-term capital gains over ₹1 lakh are taxed at 10%.`,
  },
  {
    id: "stock-market",
    title: "Stock Market Basics",
    description: "Navigate the world of equity investing",
    difficulty: "Advanced",
    points: 200,
    emoji: "📊",
    content: `The stock market is where shares of publicly-traded companies are bought and sold. When you buy stocks, you own a piece of that company and share in its growth.

**How It Works**: Companies list on stock exchanges (BSE, NSE) to raise capital. Investors trade shares based on company performance and market sentiment. Prices fluctuate based on supply-demand dynamics.

**Types of Stocks**: Large-cap stocks (established companies) offer stability. Mid-cap stocks balance growth and risk. Small-cap stocks are volatile but high-growth. Blue-chip stocks are industry leaders with consistent returns.

**Fundamental Analysis**: Study company financials—revenue growth, profit margins, debt levels, P/E ratio. Evaluate management quality and competitive advantages.

**Technical Analysis**: Use charts and patterns to predict price movements. Track support/resistance levels, moving averages, and volume trends.

**Risk Management**: Never invest more than you can afford to lose. Diversify across sectors. Use stop-losses to limit downside. Don't invest emergency funds or money needed within 5 years.

**Getting Started**: Open a demat and trading account. Start with index ETFs or blue-chip stocks. Avoid penny stocks, intraday trading, and stock tips until you gain experience.`,
  },
  {
    id: "retirement",
    title: "Retirement Planning",
    description: "Secure your financial future",
    difficulty: "Intermediate",
    points: 150,
    emoji: "🏖️",
    content: `Retirement planning ensures you maintain your lifestyle when regular income stops. Starting early gives compound interest time to work its magic.

**How Much You Need**: Multiply current annual expenses by 25-30 (assuming 3-4% withdrawal rate). If you spend ₹6 lakh/year, target ₹1.5-1.8 crore. Account for inflation.

**When to Start**: Immediately! Starting at 25 vs 35 can mean a 2-3x difference in final corpus. Even ₹2,000/month at 25 can grow to several crores by 60.

**Investment Strategy**: In your 20s-30s, allocate 70-80% to equity for growth. In 40s, shift to 60% equity. In 50s, move to 40% equity with more debt. This balances growth and safety.

**Retirement Accounts**: National Pension System (NPS) offers tax benefits and low costs. Public Provident Fund (PPF) is safe with decent returns. Employee Provident Fund (EPF) is mandatory savings with employer contribution.

**Calculating Your SIP**: Use 12% annual return assumption. To reach ₹2 crore in 30 years, invest ₹11,000/month. In 25 years, invest ₹18,000/month. Earlier you start, easier it becomes.

**Don't Rely on**: Single source like pension or property. Diversify across equity, debt, real estate. Don't count on selling home unless you'll downsize.`,
  },
  {
    id: "tax-planning",
    title: "Smart Tax Planning",
    description: "Legally minimize your tax burden",
    difficulty: "Intermediate",
    points: 150,
    emoji: "📋",
    content: `Tax planning involves organizing finances to minimize tax liability legally. Every rupee saved in tax is a rupee you can invest for your future.

**Old vs New Tax Regime**: Old regime offers deductions (80C, HRA, home loan interest) with 5-30% slabs. New regime has lower rates (0-30%) but fewer deductions. Compare both annually.

**Section 80C**: Save up to ₹1.5 lakh tax with ELSS mutual funds, PPF, EPF, life insurance premiums, home loan principal, and tuition fees. ELSS has shortest lock-in (3 years).

**Health Insurance (80D)**: Deduct ₹25,000 for self/family insurance, ₹50,000 if senior citizen. Additional ₹25,000-50,000 for parents' insurance.

**Home Loan Benefits**: Deduct ₹2 lakh interest under 24(b), ₹1.5 lakh principal under 80C. First-time buyers get additional ₹50,000 under 80EEA.

**Capital Gains**: Hold equity over 1 year for long-term gains (10% tax over ₹1 lakh). Hold debt over 3 years with indexation benefits. Plan redemptions strategically.

**Smart Strategies**: Spread investments across financial year. Use HRA if renting. Claim medical expenses. Contribute to parents' healthcare. Maximize employer-provided benefits.`,
  },
  {
    id: "credit-score",
    title: "Credit Score Management",
    description: "Build and maintain excellent credit",
    difficulty: "Beginner",
    points: 100,
    emoji: "⭐",
    content: `Your credit score (300-900) reflects creditworthiness. A high score (750+) unlocks better loan rates, credit cards, and financial opportunities.

**What Impacts Your Score**: Payment history (35%), credit utilization (30%), credit age (15%), credit mix (10%), and recent inquiries (10%).

**Payment History**: Never miss payments—set reminders or auto-pay. Even one 30-day delay can drop your score significantly. Clear dues before due dates.

**Credit Utilization**: Use less than 30% of credit limit. If limit is ₹1 lakh, spend under ₹30,000. Pay off balances in full monthly. Request limit increases to improve ratio.

**Credit Age**: Longer credit history helps. Keep old cards active with small purchases. Don't close old accounts unless necessary.

**Credit Mix**: Having varied credit (cards, loans) helps, but don't take unnecessary debt. Only borrow what you need and can repay comfortably.

**Checking Your Score**: Check free annually on CIBIL, Experian, or Equifax. Regular checks don't hurt your score. Monitor for errors and dispute inaccuracies.

**Building from Scratch**: Start with secured credit card or become authorized user. Make small purchases and pay in full. Graduate to regular cards after 6-12 months.`,
  },
  {
    id: "insurance",
    title: "Insurance Essentials",
    description: "Protect yourself and your family",
    difficulty: "Beginner",
    points: 100,
    emoji: "🛡️",
    content: `Insurance protects you from financial catastrophe due to health issues, accidents, or death. It's risk transfer, not investment.

**Term Life Insurance**: Pure protection—high coverage at low cost. Get 10-15x annual income coverage. For ₹50,000/month income, get ₹75 lakh-1 crore cover. Buy young for lower premiums.

**Health Insurance**: Medical costs are biggest wealth destroyers. Get minimum ₹5 lakh family floater, ₹10 lakh+ in metro cities. Add ₹5-10 lakh top-up (super top-up) for major illnesses.

**What to Avoid**: Avoid ULIPs and endowment plans combining insurance and investment—they're expensive and underperform. Separate insurance and investment for better returns.

**Critical Illness Cover**: Provides lump sum if diagnosed with cancer, heart attack, stroke. Use for treatment, recovery, and income loss. Get 5-10x annual income coverage.

**When to Buy**: Life insurance when you have dependents (spouse, children, parents). Health insurance immediately—medical emergencies don't wait. Younger you are, cheaper premiums.

**Claim Settlement Ratio**: Check insurer's CSR (95%+ is good). Read policy documents. Declare all pre-existing conditions honestly or risk claim rejection.`,
  },
  {
    id: "debt-management",
    title: "Debt Management",
    description: "Handle loans wisely and become debt-free",
    difficulty: "Intermediate",
    points: 150,
    emoji: "🔗",
    content: `Not all debt is bad—home loans and education loans can build wealth. But high-interest credit card debt destroys financial health.

**Good vs Bad Debt**: Good debt finances assets that appreciate (home, education) with low interest. Bad debt funds consumption (credit cards, personal loans) with high interest.

**Debt Avalanche Method**: List debts by interest rate. Pay minimums on all, throw extra money at highest-rate debt. Once cleared, tackle next highest. Mathematically optimal.

**Debt Snowball Method**: List debts by amount. Pay off smallest first for psychological wins, then tackle next. Less optimal financially but builds momentum.

**Credit Card Trap**: 36-42% annual interest is crushing. If you carry ₹50,000 balance, you pay ₹1,500-1,750 monthly in interest alone. Always pay full statement balance.

**EMI Management**: Total EMIs shouldn't exceed 40% of monthly income. Leave room for savings and emergencies. Use EMI calculators before borrowing.

**Becoming Debt-Free**: Stop taking new debt. Build emergency fund alongside repayment. Negotiate lower rates or consolidate high-interest debts. Earn extra income and direct toward debt.

**When to Take Loans**: Home loans when you'll live there 7+ years and can afford 20%+ down payment. Education loans only from reputed institutions with good placement records.`,
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
  const [isPracticeMode, setIsPracticeMode] = useState(false);
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
    // Check if already completed today (skip in practice mode)
    if (!isPracticeMode) {
      const today = new Date().toISOString().split('T')[0];
      const completedLessons = profile?.completed_lessons || [];
      const completedToday = completedLessons.some((l: any) => l.id === topic.id && l.date === today);
      
      if (completedToday && profile?.last_lesson_date === today) {
        toast({
          title: "Already Completed Today!",
          description: "You've already completed this lesson today. Come back tomorrow to maintain your streak! 🔥\n\nTip: Enable Practice Mode to retake quizzes without affecting your progress.",
          variant: "destructive",
        });
        return;
      }
    }
    
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

      // Only update database if not in practice mode
      if (!isPracticeMode) {
        // Update user profile with points and streak
        const { data: { user } } = await supabase.auth.getUser();
        if (user && profile && selectedTopic) {
          // Check if already completed today
          const today = new Date().toISOString().split('T')[0];
          const alreadyCompletedToday = profile.last_lesson_date === today;
          
          // Update streak using database function
          if (!alreadyCompletedToday) {
            await (supabase as any).rpc('update_lesson_streak', { user_id: user.id });
          }

          // Track completed lesson
          const completedLessons = profile.completed_lessons || [];
          const lessonRecord = { id: selectedTopic.id, date: today, score: Math.round(score) };
          const updatedLessons = [...completedLessons.filter((l: any) => l.id !== selectedTopic.id || l.date !== today), lessonRecord];

          // Update points
          await (supabase as any)
            .from("profiles")
            .update({
              total_points: (profile.total_points || 0) + pointsEarned,
              completed_lessons: updatedLessons,
            })
            .eq("id", user.id);
          
          await loadProfile();
        }
      }

      setShowResults(true);
      
      if (isPracticeMode) {
        toast({
          title: "🎓 Practice Complete!",
          description: `Score: ${Math.round(score)}% - Great job practicing! No points or streaks affected.`,
        });
      } else {
        const streakMessage = profile?.streak_count > 1 ? ` 🔥 ${profile.streak_count} day streak!` : "";
        toast({
          title: "🎉 Quiz Completed!",
          description: `You earned ${pointsEarned} points! Score: ${Math.round(score)}%${streakMessage}`,
        });
      }
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
            
            {/* Topic Header */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 mb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-5xl">{selectedTopic.emoji}</div>
                <div>
                  <h1 className="text-2xl font-bold cosmic-text mb-1">{selectedTopic.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-medium">
                      {selectedTopic.difficulty}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedTopic.points} points
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{selectedTopic.description}</p>
            </Card>
          </div>

          {/* Lesson Content */}
          <Card className="p-6 bg-card/80 backdrop-blur-lg border-border">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-lg">Today's Lesson</h2>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
              {selectedTopic.content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-foreground leading-relaxed">
                  {paragraph.split('**').map((text, j) => 
                    j % 2 === 1 ? <strong key={j} className="font-semibold text-primary">{text}</strong> : text
                  )}
                </p>
              ))}
            </div>
          </Card>

          {/* Start Quiz Button */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Ready to test yourself?</p>
                <p className="text-sm text-muted-foreground">10 questions • ~5 minutes</p>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
            <Button
              onClick={() => generateQuiz(selectedTopic)}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 h-12 text-base font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Quiz
            </Button>
          </Card>
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

        {/* Practice Mode Toggle */}
        <Card className="p-4 bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-accent-foreground" />
              <div>
                <p className="font-medium text-sm">Practice Mode</p>
                <p className="text-xs text-muted-foreground">Retake quizzes without affecting progress</p>
              </div>
            </div>
            <Switch
              checked={isPracticeMode}
              onCheckedChange={setIsPracticeMode}
            />
          </div>
        </Card>

        {/* Topics */}
        <div className="space-y-3">
          <h3 className="font-semibold">Learning Path</h3>
          {topics.map((topic) => {
            const today = new Date().toISOString().split('T')[0];
            const completedLessons = profile?.completed_lessons || [];
            const completedToday = completedLessons.find((l: any) => l.id === topic.id && l.date === today);
            const isCompleted = !!completedToday;
            const lastScore = completedToday?.score;

            return (
              <Card
                key={topic.id}
                className={`p-5 bg-card/80 backdrop-blur-lg border-2 transition-all ${
                  isCompleted && !isPracticeMode
                    ? 'border-success/50 bg-success/5' 
                    : 'border-border glow-card hover:scale-[1.02] hover:border-primary/50 cursor-pointer'
                }`}
                onClick={() => handleStartQuiz(topic)}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{topic.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          {topic.difficulty}
                        </span>
                        {isCompleted && (
                          <div className="flex items-center gap-1 text-success text-xs">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Completed</span>
                          </div>
                        )}
                      </div>
                      <span className="text-primary font-bold">+{topic.points}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1">{topic.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      {topic.description}
                    </p>
                    {isCompleted && lastScore !== undefined && (
                      <div className="text-sm text-success font-medium mb-3">
                        Your score: {lastScore}%
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>📝 10 questions</span>
                      <span>•</span>
                      <span>⏱️ ~5 mins</span>
                    </div>
                  </div>
                </div>
                <Button 
                  className={`w-full mt-4 h-11 ${
                    isCompleted && !isPracticeMode
                      ? 'bg-success/20 text-success hover:bg-success/30' 
                      : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
                  }`}
                  disabled={isCompleted && !isPracticeMode}
                >
                  {isCompleted && !isPracticeMode ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Done for today! Come back tomorrow
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      {isPracticeMode && isCompleted ? "Practice Again" : "Start Lesson"}
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Learn;