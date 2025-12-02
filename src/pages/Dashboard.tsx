import AppLayout from "@/components/layout/AppLayout";
import KPICard from "@/components/dashboard/KPICard";
import { Building, Users, Wrench, TrendingUp, AlertTriangle, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenus: 45000 },
  { month: "Fév", revenus: 52000 },
  { month: "Mar", revenus: 48000 },
  { month: "Avr", revenus: 61000 },
  { month: "Mai", revenus: 55000 },
  { month: "Juin", revenus: 67000 },
  { month: "Juil", revenus: 72000 },
];

const priorityColors = {
  urgent: "bg-destructive text-destructive-foreground",
  high: "bg-warning text-warning-foreground",
  medium: "bg-primary text-primary-foreground",
  low: "bg-muted text-muted-foreground",
};

const Dashboard = () => {
  const { user } = useAuth();
  const { buildings, tenants, tickets } = useData();

  const totalUnits = buildings.reduce((sum, b) => sum + b.units, 0);
  const totalOccupied = buildings.reduce((sum, b) => sum + b.occupied, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((totalOccupied / totalUnits) * 100) : 0;
  const vacantUnits = totalUnits - totalOccupied;
  const activeTenants = tenants.filter(t => t.status !== "ended").length;
  const openTickets = tickets.filter(t => t.status !== "resolved").length;
  const urgentTickets = tickets.filter(t => t.priority === "urgent" && t.status !== "resolved").length;

  const recentTickets = tickets.slice(0, 4);
  const expiringContracts = tenants.filter(t => t.status === "expiring").slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Bonjour, {user?.name.split(' ')[0]} 👋</h1>
            <p className="text-muted-foreground">Vue d'ensemble de votre portefeuille immobilier</p>
          </div>
          <Button variant="gradient" asChild>
            <Link to="/map">
              <Building className="w-4 h-4 mr-2" />
              Voir la carte
            </Link>
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Taux d'occupation"
            value={`${occupancyRate}%`}
            change="+2.3% ce mois"
            changeType="positive"
            icon={TrendingUp}
            iconColor="gradient-primary"
          />
          <KPICard
            title="Appartements"
            value={totalUnits.toString()}
            change={`${vacantUnits} vacants`}
            changeType="neutral"
            icon={Building}
          />
          <KPICard
            title="Locataires actifs"
            value={activeTenants.toString()}
            change="+5 ce mois"
            changeType="positive"
            icon={Users}
          />
          <KPICard
            title="Tickets ouverts"
            value={openTickets.toString()}
            change={`${urgentTickets} urgents`}
            changeType={urgentTickets > 0 ? "negative" : "neutral"}
            icon={Wrench}
          />
        </div>

        {/* Charts & Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Tendance des revenus</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
                <Link to="/reports">
                  Voir détails
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 50%)" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(0, 0%, 50%)" tickFormatter={(v) => `${v/1000}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 10%)",
                        border: "1px solid hsl(0, 0%, 20%)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value.toLocaleString()} FCFA`, "Revenus"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenus"
                      stroke="hsl(45, 93%, 47%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Occupation by Building Type */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Occupation par type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {['residential', 'office', 'commercial'].map((type) => {
                const typeBuildings = buildings.filter(b => b.type === type);
                const typeUnits = typeBuildings.reduce((sum, b) => sum + b.units, 0);
                const typeOccupied = typeBuildings.reduce((sum, b) => sum + b.occupied, 0);
                const typeRate = typeUnits > 0 ? Math.round((typeOccupied / typeUnits) * 100) : 0;
                const labels: Record<string, string> = { residential: 'Résidentiel', office: 'Bureaux', commercial: 'Commerces' };
                
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{labels[type]}</span>
                      <span className="text-sm text-muted-foreground">{typeRate}%</span>
                    </div>
                    <Progress value={typeRate} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Tickets */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Wrench className="w-5 h-5 text-primary" />
                Tickets récents
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/maintenance">
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                        {ticket.priority === "urgent" ? "Urgent" : ticket.priority === "high" ? "Haute" : ticket.priority === "medium" ? "Moyenne" : "Basse"}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground">{ticket.building}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{ticket.status === "new" ? "Nouveau" : ticket.status === "in_progress" ? "En cours" : ticket.status === "waiting" ? "En attente" : "Résolu"}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Expiring Contracts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Contrats expirant bientôt
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/tenants">
                  Voir tout
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {expiringContracts.length > 0 ? expiringContracts.map((tenant, idx) => (
                  <div
                    key={tenant.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {tenant.apartment} • {tenant.building}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-warning border-warning">
                      30 jours
                    </Badge>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun contrat expirant bientôt</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
