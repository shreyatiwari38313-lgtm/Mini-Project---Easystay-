import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EasyStay
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/properties">
              <Button 
                variant={isActive("/properties") ? "default" : "ghost"}
                className="hidden sm:inline-flex"
              >
                Browse Properties
              </Button>
            </Link>
            
            <Link to="/login">
              <Button variant="ghost" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            
            <Link to="/register">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
