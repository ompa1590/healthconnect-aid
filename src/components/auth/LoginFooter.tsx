
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LoginFooter: React.FC = () => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-muted"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            Don't have an account?
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <Link to="/signup">Create an account</Link>
        </Button>
      </div>
      
      <div className="mt-4 text-center">
        <Link
          to="/admin-login"
          className="text-sm font-medium text-primary hover:text-primary/90"
        >
          Healthcare Provider? Login here
        </Link>
      </div>
    </div>
  );
};

export default LoginFooter;
