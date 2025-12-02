import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  Building,
  MapPin,
  Users,
  TrendingUp,
  Edit,
  Download,
  Plus,
  Home,
  User,
  Calendar,
} from "lucide-react";

const building = {
  id: 1,
  name: "Résidence Gaia",
  address: "12 Rue des Fleurs, Dakar",
  type: "residential",
  units: 48,
  occupied: 45,
  revenue: 2450000,
  floors: 6,
  yearBuilt: 2018,
  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=400&fit=crop",
};

const apartments = [
  { id: 1, number: "101", floor: 1, surface: 65, price: 450000, status: "occupied", tenant: "Marie Dupont" },
  { id: 2, number: "102", floor: 1, surface: 72, price: 480000, status: "occupied", tenant: "Jean Martin" },
  { id: 3, number: "103", floor: 1, surface: 55, price: 380000, status: "vacant", tenant: null },
  { id: 4, number: "201", floor: 2, surface: 65, price: 460000, status: "occupied", tenant: "Sophie Leroy" },
  { id: 5, number: "202", floor: 2, surface: 72, price: 490000, status: "occupied", tenant: "Pierre Bernard" },
  { id: 6, number: "203", floor: 2, surface: 55, price: 390000, status: "occupied", tenant: "Claire Moreau" },
  { id: 7, number: "301", floor: 3, surface: 65, price: 470000, status: "occupied", tenant: "Luc Petit" },
  { id: 8, number: "302", floor: 3, surface: 72, price: 500000, status: "vacant", tenant: null },
];

const statusColors = {
  occupied: "bg-success text-success-foreground",
  vacant: "bg-warning text-warning-foreground",
  maintenance: "bg-destructive text-destructive-foreground",
};

const statusLabels = {
  occupied: "Occupé",
  vacant: "Vacant",
  maintenance: "Maintenance",
};

const BuildingDetail = () => {
  const { id } = useParams();
  const occupancyRate = Math.round((building.occupied / building.units) * 100);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/buildings">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link to="/buildings" className="hover:text-foreground">Bâtiments</Link>
                <span>/</span>
                <span>{building.name}</span>
              </div>
              <h1 className="text-2xl font-bold">{building.name}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button variant="gradient">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>
        </div>

        {/* Hero Image & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative h-64 md:h-80">
                <img
                  src={building.image}
                  alt={building.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <Badge className="bg-primary mb-2">Résidentiel</Badge>
                  <h2 className="text-2xl font-bold">{building.name}</h2>
                  <p className="flex items-center gap-1 text-white/80">
                    <MapPin className="w-4 h-4" />
                    {building.address}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Taux d'occupation</p>
                    <p className="text-2xl font-bold">{occupancyRate}%</p>
                  </div>
                </div>
                <Progress value={occupancyRate} className="h-2" />
                <p className="text-sm text-muted-foreground mt-2">{building.occupied} sur {building.units} unités</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenus mensuels</p>
                    <p className="text-2xl font-bold text-success">{building.revenue.toLocaleString()} FCFA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Étages</p>
                  <p className="text-lg font-semibold">{building.floors}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Année</p>
                  <p className="text-lg font-semibold">{building.yearBuilt}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Apartments List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              Appartements ({apartments.length})
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Étage</TableHead>
                  <TableHead>Surface</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apartments.map((apt) => (
                  <TableRow key={apt.id} className="cursor-pointer hover:bg-secondary/50">
                    <TableCell className="font-medium">Apt {apt.number}</TableCell>
                    <TableCell>{apt.floor}e</TableCell>
                    <TableCell>{apt.surface} m²</TableCell>
                    <TableCell>{apt.price.toLocaleString()} FCFA</TableCell>
                    <TableCell>
                      <Badge className={statusColors[apt.status as keyof typeof statusColors]}>
                        {statusLabels[apt.status as keyof typeof statusLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {apt.tenant ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-3 h-3 text-primary" />
                          </div>
                          <span>{apt.tenant}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default BuildingDetail;
