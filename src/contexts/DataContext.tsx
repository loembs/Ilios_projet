import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

// Types
export interface Building {
  id: number;
  name: string;
  address: string;
  type: "residential" | "office" | "commercial";
  units: number;
  occupied: number;
  revenue: number;
  image: string;
  floors?: number;
  yearBuilt?: number;
}

export interface Apartment {
  id: number;
  buildingId: number;
  number: string;
  floor: number;
  surface: number;
  price: number;
  status: "occupied" | "vacant" | "maintenance";
  tenantId?: number;
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  building: string;
  apartment: string;
  status: "active" | "expiring" | "ended";
  startDate: string;
  rent: number;
  paid: boolean;
  balance: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  building: string;
  apartment: string;
  priority: "urgent" | "high" | "medium" | "low";
  status: "new" | "in_progress" | "waiting" | "resolved";
  assignee?: string;
  createdAt: string;
  tenant: string;
}

export interface Payment {
  id: string;
  tenantId: number;
  amount: number;
  date: string;
  method: "card" | "mobile" | "cash" | "transfer";
  status: "completed" | "pending" | "failed";
}

interface DataContextType {
  // Buildings
  buildings: Building[];
  addBuilding: (building: Omit<Building, "id">) => void;
  updateBuilding: (id: number, building: Partial<Building>) => void;
  deleteBuilding: (id: number) => void;
  
  // Tenants
  tenants: Tenant[];
  addTenant: (tenant: Omit<Tenant, "id">) => void;
  updateTenant: (id: number, tenant: Partial<Tenant>) => void;
  deleteTenant: (id: number) => void;
  
  // Tickets
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, "id">) => void;
  updateTicket: (id: string, ticket: Partial<Ticket>) => void;
  deleteTicket: (id: string) => void;
  
  // Payments
  payments: Payment[];
  processPayment: (tenantId: number, amount: number, method: Payment["method"]) => void;
  
  // Notifications
  sendNotification: (tenantId: number, type: "payment_reminder" | "contract_expiry" | "ticket_update", message?: string) => void;
}

const initialBuildings: Building[] = [
  { id: 1, name: "Résidence Gaia", address: "12 Rue des Fleurs, Dakar", type: "residential", units: 48, occupied: 45, revenue: 2450000, image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop", floors: 6, yearBuilt: 2018 },
  { id: 2, name: "Tour Horizon", address: "45 Avenue Bourguiba, Dakar", type: "office", units: 24, occupied: 22, revenue: 1850000, image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", floors: 10, yearBuilt: 2015 },
  { id: 3, name: "Villa Soleil", address: "8 Rue du Port, Dakar", type: "residential", units: 12, occupied: 10, revenue: 680000, image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop", floors: 3, yearBuilt: 2020 },
  { id: 4, name: "Centre Commercial Atlas", address: "100 Boulevard Maritime", type: "commercial", units: 36, occupied: 32, revenue: 3200000, image: "https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=400&h=300&fit=crop", floors: 2, yearBuilt: 2019 },
  { id: 5, name: "Résidence Palm", address: "23 Rue Carnot, Dakar", type: "residential", units: 60, occupied: 58, revenue: 3100000, image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=300&fit=crop", floors: 8, yearBuilt: 2017 },
  { id: 6, name: "Immeuble Neptune", address: "56 Avenue Lamine Guèye", type: "office", units: 30, occupied: 28, revenue: 2100000, image: "https://images.unsplash.com/photo-1554435493-93422e8220c8?w=400&h=300&fit=crop", floors: 5, yearBuilt: 2016 },
];

const initialTenants: Tenant[] = [
  { id: 1, name: "Marie Dupont", email: "marie.dupont@email.com", phone: "+221 77 123 4567", building: "Résidence Gaia", apartment: "Apt 101", status: "active", startDate: "2023-01-15", rent: 450000, paid: true, balance: 0 },
  { id: 2, name: "Jean Martin", email: "jean.martin@email.com", phone: "+221 77 234 5678", building: "Résidence Gaia", apartment: "Apt 102", status: "active", startDate: "2022-06-01", rent: 480000, paid: true, balance: 0 },
  { id: 3, name: "Sophie Leroy", email: "sophie.leroy@email.com", phone: "+221 77 345 6789", building: "Résidence Gaia", apartment: "Apt 201", status: "active", startDate: "2023-03-10", rent: 460000, paid: false, balance: 460000 },
  { id: 4, name: "Pierre Bernard", email: "pierre.bernard@email.com", phone: "+221 77 456 7890", building: "Résidence Gaia", apartment: "Apt 202", status: "expiring", startDate: "2022-12-01", rent: 490000, paid: true, balance: 0 },
  { id: 5, name: "Claire Moreau", email: "claire.moreau@email.com", phone: "+221 77 567 8901", building: "Résidence Gaia", apartment: "Apt 203", status: "active", startDate: "2023-05-20", rent: 390000, paid: true, balance: 0 },
  { id: 6, name: "Luc Petit", email: "luc.petit@email.com", phone: "+221 77 678 9012", building: "Résidence Gaia", apartment: "Apt 301", status: "active", startDate: "2023-02-28", rent: 470000, paid: false, balance: 940000 },
  { id: 7, name: "Emma Dubois", email: "emma.dubois@email.com", phone: "+221 77 789 0123", building: "Tour Horizon", apartment: "Bureau 201", status: "active", startDate: "2022-09-15", rent: 650000, paid: true, balance: 0 },
  { id: 8, name: "Thomas Roux", email: "thomas.roux@email.com", phone: "+221 77 890 1234", building: "Tour Horizon", apartment: "Bureau 305", status: "expiring", startDate: "2022-11-01", rent: 720000, paid: true, balance: 0 },
];

const initialTickets: Ticket[] = [
  { id: "T-001", title: "Fuite d'eau sous évier", description: "Fuite importante sous l'évier de la cuisine", building: "Résidence Gaia", apartment: "Apt 302", priority: "urgent", status: "in_progress", assignee: "Ahmed Diallo", createdAt: "2024-01-15", tenant: "Marie Dupont" },
  { id: "T-002", title: "Panne électrique", description: "Plus de courant dans le salon et la chambre", building: "Tour Horizon", apartment: "Bureau 201", priority: "high", status: "new", createdAt: "2024-01-16", tenant: "Emma Dubois" },
  { id: "T-003", title: "Serrure bloquée", description: "La serrure de la porte d'entrée ne fonctionne plus", building: "Villa Soleil", apartment: "Apt 101", priority: "medium", status: "waiting", assignee: "Moussa Fall", createdAt: "2024-01-14", tenant: "Sophie Leroy" },
  { id: "T-004", title: "Climatisation HS", description: "La climatisation ne refroidit plus", building: "Résidence Gaia", apartment: "Apt 405", priority: "low", status: "resolved", assignee: "Ahmed Diallo", createdAt: "2024-01-10", tenant: "Jean Martin" },
  { id: "T-005", title: "Fissure au plafond", description: "Fissure apparue au plafond de la chambre", building: "Résidence Palm", apartment: "Apt 201", priority: "medium", status: "new", createdAt: "2024-01-16", tenant: "Pierre Bernard" },
  { id: "T-006", title: "Volet roulant bloqué", description: "Le volet roulant de la fenêtre du salon est bloqué", building: "Tour Horizon", apartment: "Bureau 305", priority: "low", status: "in_progress", assignee: "Moussa Fall", createdAt: "2024-01-13", tenant: "Thomas Roux" },
];

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [buildings, setBuildings] = useState<Building[]>(initialBuildings);
  const [tenants, setTenants] = useState<Tenant[]>(initialTenants);
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Buildings CRUD
  const addBuilding = (building: Omit<Building, "id">) => {
    const newBuilding = { ...building, id: Math.max(...buildings.map(b => b.id)) + 1 };
    setBuildings([...buildings, newBuilding]);
    toast({ title: "Bâtiment ajouté", description: `${building.name} a été créé avec succès` });
  };

  const updateBuilding = (id: number, updates: Partial<Building>) => {
    setBuildings(buildings.map(b => b.id === id ? { ...b, ...updates } : b));
    toast({ title: "Bâtiment modifié", description: "Les modifications ont été enregistrées" });
  };

  const deleteBuilding = (id: number) => {
    const building = buildings.find(b => b.id === id);
    setBuildings(buildings.filter(b => b.id !== id));
    toast({ title: "Bâtiment supprimé", description: `${building?.name} a été supprimé`, variant: "destructive" });
  };

  // Tenants CRUD
  const addTenant = (tenant: Omit<Tenant, "id">) => {
    const newTenant = { ...tenant, id: Math.max(...tenants.map(t => t.id)) + 1 };
    setTenants([...tenants, newTenant]);
    toast({ title: "Locataire ajouté", description: `${tenant.name} a été ajouté avec succès` });
  };

  const updateTenant = (id: number, updates: Partial<Tenant>) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, ...updates } : t));
    toast({ title: "Locataire modifié", description: "Les modifications ont été enregistrées" });
  };

  const deleteTenant = (id: number) => {
    const tenant = tenants.find(t => t.id === id);
    setTenants(tenants.filter(t => t.id !== id));
    toast({ title: "Locataire supprimé", description: `${tenant?.name} a été supprimé`, variant: "destructive" });
  };

  // Tickets CRUD
  const addTicket = (ticket: Omit<Ticket, "id">) => {
    const newId = `T-${String(tickets.length + 1).padStart(3, '0')}`;
    const newTicket = { ...ticket, id: newId };
    setTickets([...tickets, newTicket]);
    toast({ title: "Ticket créé", description: `${newId} - ${ticket.title}` });
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, ...updates } : t));
    toast({ title: "Ticket mis à jour", description: `${id} a été modifié` });
  };

  const deleteTicket = (id: string) => {
    setTickets(tickets.filter(t => t.id !== id));
    toast({ title: "Ticket supprimé", description: `${id} a été supprimé`, variant: "destructive" });
  };

  // Payments
  const processPayment = (tenantId: number, amount: number, method: Payment["method"]) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const payment: Payment = {
      id: `PAY-${Date.now()}`,
      tenantId,
      amount,
      date: new Date().toISOString(),
      method,
      status: "completed",
    };

    setPayments([...payments, payment]);
    
    // Update tenant balance
    const newBalance = Math.max(0, tenant.balance - amount);
    const isPaid = newBalance === 0;
    updateTenant(tenantId, { balance: newBalance, paid: isPaid });

    toast({
      title: "Paiement effectué",
      description: `${amount.toLocaleString()} FCFA reçus de ${tenant.name}`,
    });
  };

  // Notifications
  const sendNotification = (tenantId: number, type: string, message?: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return;

    const messages: Record<string, string> = {
      payment_reminder: `Rappel de paiement envoyé à ${tenant.name}`,
      contract_expiry: `Notification de fin de contrat envoyée à ${tenant.name}`,
      ticket_update: `Mise à jour de ticket envoyée à ${tenant.name}`,
    };

    toast({
      title: "Notification envoyée",
      description: message || messages[type] || `Notification envoyée à ${tenant.name}`,
    });
  };

  return (
    <DataContext.Provider value={{
      buildings, addBuilding, updateBuilding, deleteBuilding,
      tenants, addTenant, updateTenant, deleteTenant,
      tickets, addTicket, updateTicket, deleteTicket,
      payments, processPayment,
      sendNotification,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};
