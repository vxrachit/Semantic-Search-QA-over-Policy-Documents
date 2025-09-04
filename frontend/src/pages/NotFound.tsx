import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center px-6">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          
          <Button asChild className="flex items-center gap-2">
            <a href="/">
              <Home className="h-4 w-4" />
              Return Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
