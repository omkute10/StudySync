
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useSignup, Interest } from "@/contexts/SignupContext";
import { useToast } from "@/hooks/use-toast";

const interests: Interest[] = [
  "Java", "React", "Python", "SpringBoot", 
  "JavaScript", "TypeScript", "MongoDB", "PostgreSQL", 
  "AI", "MachineLearning", "WebDev", "DataScience"
];

const SignupInterests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { interests: selectedInterests, toggleInterest } = useSignup();

  const handleNext = () => {
    if (selectedInterests.length === 0) {
      toast({
        title: "Select at least one interest",
        description: "Please select at least one interest to continue",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Interests saved!",
      description: "Now let's select your role on Learnix",
    });
    
    navigate("/signup/role");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-accent-light/20 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-2">Study Interests</h1>
        <p className="text-gray-600 text-center mb-8">Step 2 of 3: Select topics you're interested in</p>
        
        <GlassCard className="max-w-2xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {interests.map((interest) => (
              <div
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`
                  p-4 rounded-lg cursor-pointer text-center transition-all duration-300
                  ${selectedInterests.includes(interest)
                    ? "bg-secondary/30 border-2 border-secondary shadow-lg shadow-secondary/20"
                    : "bg-white/50 border border-gray-200 hover:bg-white/80"}
                `}
              >
                {interest}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Next Step <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SignupInterests;
