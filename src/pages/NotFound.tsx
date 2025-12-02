import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center animate-scale-in">
        <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oups ! Cette page n'existe pas
        </p>
        <Button variant="gradient" asChild>
          <Link to="/dashboard">
            <Home className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
