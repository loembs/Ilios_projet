import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Grid3X3, List, MapPin, Users, TrendingUp, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useData, Building } from "@/contexts/DataContext";
import BuildingModal from "@/components/modals/BuildingModal";

const typeColors = {
  residential: "bg-primary text-primary-foreground",
  office: "bg-accent text-accent-foreground",
  commercial: "bg-success text-success-foreground",
};

const typeLabels = {
  residential: "Résidentiel",
  office: "Bureaux",
  commercial: "Commercial",
};

const Buildings = () => {
  const { buildings, deleteBuilding } = useData();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editBuilding, setEditBuilding] = useState<Building | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<Building | null>(null);

  const filteredBuildings = buildings.filter((b) => {
    if (typeFilter !== "all" && b.type !== typeFilter) return false;
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (building: Building) => {
    setEditBuilding(building);
    setModalOpen(true);
  };

  const handleDelete = (building: Building) => {
    setBuildingToDelete(building);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (buildingToDelete) {
      deleteBuilding(buildingToDelete.id);
    }
    setDeleteDialogOpen(false);
    setBuildingToDelete(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Bâtiments</h1>
            <p className="text-muted-foreground">{filteredBuildings.length} bâtiments dans votre portefeuille</p>
          </div>
          <Button variant="gradient" onClick={() => { setEditBuilding(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un bâtiment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un bâtiment..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="residential">Résidentiel</SelectItem>
                <SelectItem value="office">Bureaux</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBuildings.map((building, idx) => {
              const occupancyRate = Math.round((building.occupied / building.units) * 100);
              return (
                <Card key={building.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group animate-scale-in" style={{ animationDelay: `${idx * 0.05}s` }}>
                  <Link to={`/buildings/${building.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={building.image}
                        alt={building.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className={typeColors[building.type as keyof typeof typeColors]}>
                          {typeLabels[building.type as keyof typeof typeLabels]}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <Link to={`/buildings/${building.id}`} className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{building.name}</h3>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(building)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(building)}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                      <MapPin className="w-3 h-3" />
                      {building.address}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Occupation
                        </span>
                        <span className="font-medium">{building.occupied}/{building.units}</span>
                      </div>
                      <Progress value={occupancyRate} className="h-2" />
                      
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          Revenus mensuels
                        </span>
                        <span className="font-semibold text-primary">
                          {building.revenue.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bâtiment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unités</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead>Revenus</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBuildings.map((building) => {
                  const occupancyRate = Math.round((building.occupied / building.units) * 100);
                  return (
                    <TableRow key={building.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={building.image}
                            alt={building.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{building.name}</p>
                            <p className="text-sm text-muted-foreground">{building.address}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={typeColors[building.type as keyof typeof typeColors]}>
                          {typeLabels[building.type as keyof typeof typeLabels]}
                        </Badge>
                      </TableCell>
                      <TableCell>{building.units}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={occupancyRate} className="w-20 h-2" />
                          <span className="text-sm">{occupancyRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {building.revenue.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/buildings/${building.id}`}>Voir détails</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(building)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(building)}>
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </div>
          </Card>
        )}
      </div>

      <BuildingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        building={editBuilding}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le bâtiment ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{buildingToDelete?.name}" ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Buildings;
