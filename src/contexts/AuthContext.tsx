import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "gestionnaire" | "technicien" | "locataire";
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: (User & { password: string })[] = [
  { id: "1", name: "Dialo Admin", email: "admin@ilios.com", password: "admin123", role: "admin" },
  { id: "2", name: "Sophie Gestionnaire", email: "gestionnaire@ilios.com", password: "gest123", role: "gestionnaire" },
  { id: "3", name: "Ahmed Technicien", email: "tech@ilios.com", password: "tech123", role: "technicien" },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("ilios_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("ilios_user", JSON.stringify(userWithoutPassword));
      toast({
        title: "Connexion réussie",
        description: `Bienvenue, ${foundUser.name}!`,
      });
      return true;
    }
    
    toast({
      title: "Erreur de connexion",
      description: "Email ou mot de passe incorrect",
      variant: "destructive",
    });
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ilios_user");
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
