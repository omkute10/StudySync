import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth(); // Get login from context
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Perform Firebase login
      await login(values.email, values.password);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login Error:", error);
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-accent-light/20 p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome Back!</h1>
        <p className="text-gray-600 text-center mb-8">Log in to your StudySync account</p>
        
        <GlassCard>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Log in
                  </div>
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Login;