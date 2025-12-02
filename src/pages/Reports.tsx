import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData } from "@/contexts/DataContext";
import { Download, TrendingUp, TrendingDown, Building, Users, Wrench, Wallet } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const revenueData = [
  { month: "Jan", revenus: 12500000, depenses: 2800000 },
  { month: "Fév", revenus: 13200000, depenses: 3100000 },
  { month: "Mar", revenus: 12800000, depenses: 2600000 },
  { month: "Avr", revenus: 14100000, depenses: 2900000 },
  { month: "Mai", revenus: 13500000, depenses: 3200000 },
  { month: "Juin", revenus: 14700000, depenses: 2700000 },
];

const occupationData = [
  { name: "Résidentiel", occupé: 168, vacant: 12 },
  { name: "Bureaux", occupé: 50, vacant: 4 },
  { name: "Commercial", occupé: 32, vacant: 4 },
];

const COLORS = ["hsl(45, 93%, 47%)", "hsl(45, 50%, 80%)"];

const Reports = () => {
  const { buildings, tenants, tickets } = useData();

  const totalRevenue = buildings.reduce((sum, b) => sum + b.revenue, 0);
  const totalUnits = buildings.reduce((sum, b) => sum + b.units, 0);
  const totalOccupied = buildings.reduce((sum, b) => sum + b.occupied, 0);
  const occupancyRate = Math.round((totalOccupied / totalUnits) * 100);
  const unpaidCount = tenants.filter(t => !t.paid).length;
  const openTickets = tickets.filter(t => t.status !== "resolved").length;

  const pieData = [
    { name: "Occupé", value: totalOccupied },
    { name: "Vacant", value: totalUnits - totalOccupied },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Rapports</h1>
            <p className="text-muted-foreground">Analyse et statistiques de votre portefeuille</p>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="6months">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 mois</SelectItem>
                <SelectItem value="3months">3 mois</SelectItem>
                <SelectItem value="6months">6 mois</SelectItem>
                <SelectItem value="1year">1 an</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter PDF
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenus totaux</p>
                  <p className="text-2xl font-bold">{(totalRevenue / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +12.5% vs mois dernier
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Taux d'occupation</p>
                  <p className="text-2xl font-bold">{occupancyRate}%</p>
                  <p className="text-xs text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +2.3% ce mois
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                  <Building className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Impayés</p>
                  <p className="text-2xl font-bold">{unpaidCount}</p>
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" /> 2 nouveaux
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tickets ouverts</p>
                  <p className="text-2xl font-bold">{openTickets}</p>
                  <p className="text-xs text-warning flex items-center gap-1">
                    <Wrench className="w-3 h-3" /> 3 urgents
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenus vs Dépenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(45, 93%, 47%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                    <XAxis dataKey="month" stroke="hsl(0, 0%, 50%)" />
                    <YAxis stroke="hsl(0, 0%, 50%)" tickFormatter={(v) => `${v / 1000000}M`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 10%)",
                        border: "1px solid hsl(0, 0%, 20%)",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${(value / 1000000).toFixed(1)}M FCFA`]}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="revenus" stroke="hsl(45, 93%, 47%)" fillOpacity={1} fill="url(#colorRevenue)" name="Revenus" />
                    <Area type="monotone" dataKey="depenses" stroke="hsl(0, 84%, 60%)" fillOpacity={1} fill="url(#colorDepenses)" name="Dépenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Occupation Pie */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition occupation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Occupation by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Occupation par type de bâtiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 20%)" />
                  <XAxis dataKey="name" stroke="hsl(0, 0%, 50%)" />
                  <YAxis stroke="hsl(0, 0%, 50%)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 10%)",
                      border: "1px solid hsl(0, 0%, 20%)",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="occupé" fill="hsl(45, 93%, 47%)" name="Occupé" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vacant" fill="hsl(0, 0%, 30%)" name="Vacant" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
