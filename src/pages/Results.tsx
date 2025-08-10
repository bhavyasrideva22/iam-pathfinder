import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Answer } from "./Assessment";
import { 
  TrendingUp, 
  Brain, 
  Target, 
  BookOpen, 
  Award, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Lightbulb,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface WISCARScores {
  will: number;
  interest: number;
  skill: number;
  cognitiveReadiness: number;
  abilityToLearn: number;
  realWorldAlignment: number;
  overall: number;
}

interface Recommendation {
  type: 'proceed' | 'maybe' | 'not-ready';
  confidence: number;
  message: string;
  nextSteps: string[];
}

const Results = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [scores, setScores] = useState<WISCARScores | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAnswers = localStorage.getItem('assessmentAnswers');
    if (!storedAnswers) {
      toast.error("No assessment data found. Please complete the assessment first.");
      navigate('/assessment');
      return;
    }

    const parsedAnswers: Answer[] = JSON.parse(storedAnswers);
    setAnswers(parsedAnswers);
    
    // Calculate scores
    const calculatedScores = calculateWISCARScores(parsedAnswers);
    setScores(calculatedScores);
    
    // Generate recommendation
    const rec = generateRecommendation(calculatedScores);
    setRecommendation(rec);
    
    setLoading(false);
  }, [navigate]);

  const calculateWISCARScores = (answers: Answer[]): WISCARScores => {
    // Interest & Motivation (Will + Interest)
    const interestAnswers = answers.filter(a => a.questionId.startsWith('interest-'));
    const interestScore = interestAnswers.reduce((sum, answer) => sum + (answer.value as number), 0) / interestAnswers.length;
    const willScore = interestScore; // Simplified - using same data
    const interest = Math.min(100, (interestScore / 5) * 100);

    // Personality & Technical (Skill + Cognitive Readiness)
    const personalityAnswers = answers.filter(a => a.questionId.startsWith('personality-'));
    const personalityScore = personalityAnswers.reduce((sum, answer) => sum + (answer.value as number), 0) / personalityAnswers.length;
    
    const technicalAnswers = answers.filter(a => a.questionId.startsWith('technical-'));
    const technicalScore = calculateTechnicalScore(technicalAnswers);
    
    const skill = Math.min(100, (technicalScore / 100) * 100);
    const cognitiveReadiness = Math.min(100, (personalityScore / 5) * 100);

    // Learning (Ability to Learn)
    const learningAnswers = answers.filter(a => a.questionId.startsWith('learning-'));
    const learningScore = learningAnswers.reduce((sum, answer) => {
      if (typeof answer.value === 'number') {
        return sum + (answer.questionId === 'learning-1' ? answer.value / 20 : answer.value / 5);
      }
      return sum;
    }, 0) / learningAnswers.length;
    const abilityToLearn = Math.min(100, learningScore * 100);

    // Real World Alignment (composite score)
    const realWorldAlignment = (interest + skill + cognitiveReadiness) / 3;

    // Overall confidence score
    const overall = (willScore + interest + skill + cognitiveReadiness + abilityToLearn + realWorldAlignment) / 6;

    return {
      will: Math.round(willScore),
      interest: Math.round(interest),
      skill: Math.round(skill),
      cognitiveReadiness: Math.round(cognitiveReadiness),
      abilityToLearn: Math.round(abilityToLearn),
      realWorldAlignment: Math.round(realWorldAlignment),
      overall: Math.round(overall)
    };
  };

  const calculateTechnicalScore = (technicalAnswers: Answer[]): number => {
    const correctAnswers = {
      'technical-1': 'To add an extra layer of security beyond passwords',
      'technical-2': 'SAML'
    };
    
    let correct = 0;
    technicalAnswers.forEach(answer => {
      if (correctAnswers[answer.questionId as keyof typeof correctAnswers] === answer.value) {
        correct++;
      }
    });
    
    return (correct / Object.keys(correctAnswers).length) * 100;
  };

  const generateRecommendation = (scores: WISCARScores): Recommendation => {
    if (scores.overall >= 75) {
      return {
        type: 'proceed',
        confidence: scores.overall,
        message: "Excellent! You show strong potential for becoming an IAM Specialist. Your combination of interest, skills, and learning ability indicates you're well-suited for this career path.",
        nextSteps: [
          "Start with IAM fundamentals course (CompTIA Security+)",
          "Get hands-on experience with Azure AD or Okta",
          "Join cybersecurity communities and forums",
          "Consider pursuing relevant certifications"
        ]
      };
    } else if (scores.overall >= 50) {
      return {
        type: 'maybe',
        confidence: scores.overall,
        message: "You have potential for IAM roles, but some areas need development. Focus on strengthening your weak points before fully committing to this career path.",
        nextSteps: [
          "Build foundational cybersecurity knowledge",
          "Improve technical skills through online courses",
          "Network with IAM professionals",
          "Consider starting in adjacent roles (IT Support, Network Admin)"
        ]
      };
    } else {
      return {
        type: 'not-ready',
        confidence: scores.overall,
        message: "Based on your current profile, IAM might not be the best fit right now. Consider exploring other IT roles or building foundational skills first.",
        nextSteps: [
          "Explore alternative IT career paths",
          "Build basic technical skills",
          "Consider roles in IT support or help desk",
          "Retake this assessment after 6 months of skill building"
        ]
      };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 75) return "default";
    if (score >= 50) return "secondary";
    return "destructive";
  };

  const wiscarData = [
    { key: 'will', label: 'Will (Motivation)', description: 'Your drive and commitment to pursue IAM', icon: Target },
    { key: 'interest', label: 'Interest', description: 'Your curiosity and passion for IAM topics', icon: Brain },
    { key: 'skill', label: 'Current Skills', description: 'Your existing technical knowledge and abilities', icon: Award },
    { key: 'cognitiveReadiness', label: 'Cognitive Readiness', description: 'Your analytical and problem-solving aptitude', icon: BarChart3 },
    { key: 'abilityToLearn', label: 'Learning Ability', description: 'Your capacity to acquire new skills', icon: BookOpen },
    { key: 'realWorldAlignment', label: 'Role Alignment', description: 'How well you match real IAM job requirements', icon: TrendingUp }
  ];

  const careerPaths = [
    { title: "IAM Specialist", match: scores?.overall || 0, description: "Manages user identities and access policies" },
    { title: "Cybersecurity Analyst", match: (scores?.cognitiveReadiness || 0), description: "Monitors threats and enforces security" },
    { title: "Cloud Security Engineer", match: (scores?.skill || 0), description: "Secures cloud infrastructure and IAM" },
    { title: "Compliance Officer", match: (scores?.will || 0), description: "Ensures regulatory compliance" }
  ];

  if (loading || !scores || !recommendation) {
    return (
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your IAM Assessment Results</h1>
          <p className="text-xl text-muted-foreground">Discover your readiness for Identity & Access Management careers</p>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 shadow-glow border-primary/20">
          <CardHeader className="text-center bg-gradient-primary text-primary-foreground rounded-t-lg">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              {recommendation.type === 'proceed' && <CheckCircle2 className="w-6 h-6" />}
              {recommendation.type === 'maybe' && <AlertTriangle className="w-6 h-6" />}
              {recommendation.type === 'not-ready' && <AlertTriangle className="w-6 h-6" />}
              Overall Confidence Score
            </CardTitle>
            <div className="text-4xl font-bold">{scores.overall}%</div>
          </CardHeader>
          <CardContent className="pt-6">
            <Badge 
              variant={getScoreBadgeVariant(scores.overall)} 
              className="mb-4 text-lg px-4 py-2"
            >
              {recommendation.type === 'proceed' && "Highly Recommended"}
              {recommendation.type === 'maybe' && "Proceed with Caution"}
              {recommendation.type === 'not-ready' && "Build More Skills First"}
            </Badge>
            <p className="text-lg text-muted-foreground">{recommendation.message}</p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* WISCAR Analysis */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                WISCAR Framework Analysis
              </CardTitle>
              <CardDescription>
                Detailed breakdown of your readiness across six key dimensions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {wiscarData.map((item) => {
                const score = scores[item.key as keyof WISCARScores];
                const Icon = item.icon;
                return (
                  <div key={item.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Career Paths */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Career Path Matches
              </CardTitle>
              <CardDescription>
                How well you align with different IAM-related roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerPaths.map((career, index) => (
                <div key={index} className="space-y-2 p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{career.title}</h3>
                    <Badge variant="outline" className={getScoreColor(career.match)}>
                      {career.match}% match
                    </Badge>
                  </div>
                  <Progress value={career.match} className="h-1" />
                  <p className="text-sm text-muted-foreground">{career.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Recommended Next Steps
            </CardTitle>
            <CardDescription>
              Personalized guidance based on your assessment results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-foreground">Immediate Actions</h3>
                <ul className="space-y-2">
                  {recommendation.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-foreground">Learning Resources</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">CompTIA Security+</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Foundation cybersecurity certification</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Azure AD Training</span>
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Hands-on identity management</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="text-center space-y-4">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Retake Assessment
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const results = { scores, recommendation, timestamp: new Date().toISOString() };
              const dataStr = JSON.stringify(results, null, 2);
              const dataBlob = new Blob([dataStr], { type: 'application/json' });
              const url = URL.createObjectURL(dataBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'iam-assessment-results.json';
              link.click();
              toast.success("Results downloaded successfully!");
            }}
          >
            Download Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;