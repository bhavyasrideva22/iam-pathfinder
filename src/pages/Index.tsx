import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, Lock, Cloud, CheckCircle2, Clock, Target } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate("/assessment");
  };

  const benefits = [
    {
      icon: Target,
      title: "Career Fit Analysis",
      description: "Discover if IAM specialist roles align with your interests and strengths"
    },
    {
      icon: CheckCircle2,
      title: "Skills Assessment",
      description: "Evaluate your technical readiness and identify knowledge gaps"
    },
    {
      icon: Cloud,
      title: "Personalized Learning Path",
      description: "Get customized recommendations for tools, courses, and certifications"
    }
  ];

  const careerPaths = [
    "IAM Specialist",
    "Cybersecurity Analyst", 
    "Cloud Security Engineer",
    "Compliance & Risk Officer",
    "Identity Governance Analyst"
  ];

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary border-primary/20">
            IAM Career Assessment
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your Readiness & Fit for
            <span className="bg-gradient-primary bg-clip-text text-transparent block mt-2">
              Identity & Access Management
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Discover if you're ready to become an IAM Specialist with our scientifically validated assessment. 
            Get personalized insights, career guidance, and learning recommendations in just 20-30 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={handleStartAssessment}
              className="group"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">20-30 minutes</span>
            </div>
          </div>
        </div>

        {/* What is IAM Section */}
        <Card className="mb-16 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              What is Identity & Access Management?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-center text-lg leading-relaxed max-w-3xl mx-auto">
              IAM is the practice of managing digital identities, controlling access rights, and ensuring security 
              across organizations. IAM specialists work with cutting-edge tools to protect data and systems.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Identity Management</h3>
                <p className="text-sm text-muted-foreground">Managing user identities and profiles across systems</p>
              </div>
              <div className="text-center p-4">
                <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Access Control</h3>
                <p className="text-sm text-muted-foreground">Controlling who can access what resources and when</p>
              </div>
              <div className="text-center p-4">
                <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Security & Compliance</h3>
                <p className="text-sm text-muted-foreground">Ensuring security policies and regulatory compliance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Why Take This Assessment?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <benefit.icon className="w-8 h-8 text-primary mb-2" />
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Career Paths Section */}
        <Card className="mb-16 shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Career Paths You Could Unlock</CardTitle>
            <CardDescription>Discover the roles that match your IAM expertise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-3">
              {careerPaths.map((career, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm bg-primary/5 border-primary/20 text-primary">
                  {career}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-primary rounded-2xl p-8 text-primary-foreground shadow-glow">
          <h2 className="text-2xl font-bold mb-4">Ready to Discover Your IAM Potential?</h2>
          <p className="text-primary-foreground/90 mb-6 text-lg">
            Join thousands who have already discovered their perfect career fit in cybersecurity
          </p>
          <Button 
            variant="secondary" 
            size="xl" 
            onClick={handleStartAssessment}
            className="group bg-background text-foreground hover:bg-background/90"
          >
            Begin Your Assessment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;