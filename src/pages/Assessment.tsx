import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export interface Question {
  id: string;
  section: string;
  type: 'likert' | 'multiple-choice' | 'slider';
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

export interface Answer {
  questionId: string;
  value: string | number;
}

const questions: Question[] = [
  {
    id: "interest-1",
    section: "Interest & Motivation",
    type: "likert",
    question: "How interested are you in cybersecurity and identity management?",
    options: ["Not at all interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: "interest-2", 
    section: "Interest & Motivation",
    type: "likert",
    question: "How excited are you about working with security tools and technologies?",
    options: ["Not excited", "Slightly excited", "Moderately excited", "Very excited", "Extremely excited"]
  },
  {
    id: "personality-1",
    section: "Personality & Fit",
    type: "likert", 
    question: "I pay close attention to details and am thorough in my work",
    options: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
  },
  {
    id: "personality-2",
    section: "Personality & Fit",
    type: "likert",
    question: "I enjoy solving complex problems and troubleshooting issues",
    options: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
  },
  {
    id: "technical-1",
    section: "Technical Knowledge",
    type: "multiple-choice",
    question: "What is the main purpose of Multi-Factor Authentication (MFA)?",
    options: [
      "To make passwords more complex",
      "To add an extra layer of security beyond passwords", 
      "To encrypt user data",
      "To monitor user activity"
    ]
  },
  {
    id: "technical-2",
    section: "Technical Knowledge", 
    type: "multiple-choice",
    question: "Which protocol is primarily used for secure user authentication?",
    options: ["HTTP", "SAML", "FTP", "SMTP"]
  },
  {
    id: "learning-1",
    section: "Learning & Growth",
    type: "slider",
    question: "How many hours per week do you typically spend learning new technical skills?",
    min: 0,
    max: 20,
    step: 1
  },
  {
    id: "learning-2",
    section: "Learning & Growth",
    type: "likert",
    question: "I am comfortable learning new technologies and adapting to changes",
    options: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
  }
];

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const steps = [
    { id: "interest", title: "Interest", completed: currentQuestionIndex > 1 },
    { id: "personality", title: "Personality", completed: currentQuestionIndex > 3 },
    { id: "technical", title: "Technical", completed: currentQuestionIndex > 5 },
    { id: "learning", title: "Learning", completed: currentQuestionIndex >= 7 }
  ];

  const getCurrentAnswer = () => {
    return answers.find(a => a.questionId === currentQuestion?.id);
  };

  const handleAnswer = (value: string | number) => {
    const existingAnswerIndex = answers.findIndex(a => a.questionId === currentQuestion.id);
    const newAnswer: Answer = { questionId: currentQuestion.id, value };
    
    if (existingAnswerIndex >= 0) {
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = newAnswer;
      setAnswers(newAnswers);
    } else {
      setAnswers([...answers, newAnswer]);
    }
  };

  const handleNext = () => {
    const currentAnswer = getCurrentAnswer();
    if (!currentAnswer) {
      toast.error("Please answer the current question before proceeding.");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsComplete(true);
      // Store answers in localStorage for results page
      localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
      navigate('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderQuestion = () => {
    const currentAnswer = getCurrentAnswer();

    if (currentQuestion.type === 'likert') {
      return (
        <RadioGroup 
          value={currentAnswer?.value?.toString() || ""} 
          onValueChange={(value) => handleAnswer(parseInt(value))}
          className="space-y-3"
        >
          {currentQuestion.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (currentQuestion.type === 'multiple-choice') {
      return (
        <RadioGroup 
          value={currentAnswer?.value?.toString() || ""} 
          onValueChange={(value) => handleAnswer(value)}
          className="space-y-3"
        >
          {currentQuestion.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-sm">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    if (currentQuestion.type === 'slider') {
      return (
        <div className="space-y-6">
          <div className="px-3">
            <Slider
              value={[currentAnswer?.value as number || 0]}
              onValueChange={(value) => handleAnswer(value[0])}
              max={currentQuestion.max}
              min={currentQuestion.min}
              step={currentQuestion.step}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{currentQuestion.min} hours</span>
            <span className="font-medium text-primary">
              {currentAnswer?.value || 0} hours per week
            </span>
            <span>{currentQuestion.max} hours</span>
          </div>
        </div>
      );
    }

    return null;
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-bg py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <ProgressIndicator 
          steps={steps} 
          currentStep={Math.floor(currentQuestionIndex / 2)} 
          progress={progress} 
        />
        
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <div className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                {currentQuestion.section}
              </div>
              <div className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
            </div>
            <CardTitle className="text-xl leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.section === "Technical Knowledge" && (
              <CardDescription>
                Choose the best answer based on your current knowledge
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {renderQuestion()}
            
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button 
                variant="assessment" 
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                {currentQuestionIndex === questions.length - 1 ? "Complete Assessment" : "Next"}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Assessment;