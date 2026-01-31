
import { registerUser } from "@/api/auth.api"; // Ensure this path is correct

import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";

const Register = () => {
  // Check if registerUser is defined
  if (!registerUser) {
    console.error("registerUser is not defined");
  }
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "guest" as "guest" | "host"
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      console.log("📝 [REGISTER PAGE] Starting registration with data:", {
        name: formData.name,
        email: formData.email,
        role: formData.role
      });
      
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      
      console.log("✅ [REGISTER PAGE] Registration successful, response:", response);
      toast.success(response.message || "Account created successfully!");
      navigate(formData.role === "host" ? "/host-dashboard" : "/guest-dashboard");
    } catch (error: any) {
      console.error("❌ [REGISTER PAGE] Registration failed with error:", {
        error,
        message: error?.message,
        isNetworkError: error?.message?.includes?.("Network") || error?.code === "ERR_NETWORK"
      });
      const errorMessage = error?.message || error?.errors?.[0]?.msg || "Failed to create account. Please try again.";
      toast.error(errorMessage);
    }
  }, [formData, navigate]);

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EasyStay
            </span>
          </Link>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Join EasyStay to start your journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>I want to</Label>
              <RadioGroup 
                value={formData.role} 
                onValueChange={(value) => setFormData({...formData, role: value as "guest" | "host"})}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="guest" id="guest" />
                  <Label htmlFor="guest" className="font-normal cursor-pointer">
                    Book properties (Guest)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="host" id="host" />
                  <Label htmlFor="host" className="font-normal cursor-pointer">
                    List my property (Host)
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button type="submit" className="w-full" size="lg">
              Create Account
            </Button>
          </form>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
