import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload, BookOpen, Users, Laptop } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/contexts/SignupContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const SignupRole = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    role, 
    setRole, 
    studentType, 
    setStudentType,
    // Get all the data collected from previous steps
    name,
    age,
    gender,
    degree,
    email,
    password, // Ensure you have added password to SignupContext as per instructions
    interests
  } = useSignup();
  
  const { signup } = useAuth(); // Get the signup function from AuthContext
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!role) {
      toast({
        title: "Select a role",
        description: "Please select a role to continue",
        variant: "destructive",
      });
      return;
    }

    if (role === "Student" && !studentType) {
      toast({
        title: "Select a student type",
        description: "Please select what you're looking for",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the additional user data for Firestore
      const userData = {
        name,
        age,
        gender,
        degree,
        role,
        studentType: role === "Student" ? studentType : null,
        interests
      };

      // Create the user in Firebase Auth and save profile to Firestore
      await signup(email, password, userData);

      toast({
        title: "Signup complete!",
        description: "Welcome to StudySync! You're all set.",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Signup Error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during account creation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-accent-light/20 p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-2">Choose Your Role</h1>
        <p className="text-gray-600 text-center mb-8">Step 3 of 3: How will you use StudySync?</p>
        
        <GlassCard className="max-w-3xl">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div
                onClick={() => setRole("Student")}
                className={`
                  p-6 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center
                  ${role === "Student"
                    ? "bg-secondary/30 border-2 border-secondary shadow-lg shadow-secondary/20"
                    : "bg-white/50 border border-gray-200 hover:bg-white/80"}
                `}
              >
                <Users className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold">Student</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  I'm looking for study help or partners
                </p>
              </div>
              
              <div
                onClick={() => {
                  setRole("Tutor");
                  setStudentType(null);
                }}
                className={`
                  p-6 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center
                  ${role === "Tutor"
                    ? "bg-secondary/30 border-2 border-secondary shadow-lg shadow-secondary/20"
                    : "bg-white/50 border border-gray-200 hover:bg-white/80"}
                `}
              >
                <Laptop className="h-12 w-12 mb-4 text-primary" />
                <h3 className="text-xl font-semibold">Tutor</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  I want to help others learn
                </p>
              </div>
            </div>
            
            {role === "Student" && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">What are you looking for?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setStudentType("TutorSeeker")}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center
                      ${studentType === "TutorSeeker"
                        ? "bg-accent/30 border-2 border-accent shadow-md"
                        : "bg-white/50 border border-gray-200 hover:bg-white/80"}
                    `}
                  >
                    <BookOpen className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="font-medium">Find a Tutor</h4>
                  </div>
                  
                  <div
                    onClick={() => setStudentType("StudyBuddy")}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center
                      ${studentType === "StudyBuddy"
                        ? "bg-accent/30 border-2 border-accent shadow-md"
                        : "bg-white/50 border border-gray-200 hover:bg-white/80"}
                    `}
                  >
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="font-medium">Find a Study Buddy</h4>
                  </div>
                  
                  <div
                    onClick={() => setStudentType("CampusPartner")}
                    className={`
                      p-4 rounded-lg cursor-pointer transition-all duration-300 flex flex-col items-center
                      ${studentType === "CampusPartner"
                        ? "bg-accent/30 border-2 border-accent shadow-md"
                        : "bg-white/50 border border-gray-200 hover:bg-white/80"}
                    `}
                  >
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <h4 className="font-medium">Find a Campus Partner</h4>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex flex-col items-center">
              <Button 
                onClick={() => {
                  const fileInput = document.createElement('input');
                  fileInput.type = 'file';
                  fileInput.accept = '.pdf';
                  fileInput.click();
                  
                  fileInput.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files.length > 0) {
                      toast({
                        title: "PDF Uploaded",
                        description: "We'll analyze and summarize your syllabus!",
                      });
                    }
                  };
                }}
                variant="outline"
                className="mb-6 bg-white/70"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Syllabus for AI Analysis
              </Button>
              
              <Button 
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90 text-white px-8"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : (
                  <>
                    Complete Signup <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default SignupRole;