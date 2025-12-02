import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Building, MapPin, Navigation, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useData } from "@/contexts/DataContext";
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

const MapView = () => {
  const { buildings } = useData();
  const [selectedBuilding, setSelectedBuilding] = useState<typeof buildings[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    showVacant: false,
  });

  const filteredBuildings = buildings.filter((b) => {
    if (filters.type !== "all" && b.type !== filters.type) return false;
    if (filters.showVacant && b.occupied === b.units) return false;
    if (searchQuery && !b.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cartographie</h1>
            <p className="text-muted-foreground">{filteredBuildings.length} bâtiments affichés</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
            <Button variant="gradient" onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un bâtiment
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-72 space-y-4 animate-slide-in-left flex-shrink-0">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Rechercher</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Nom du bâtiment..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de bien</label>
                    <Select value={filters.type} onValueChange={(v) => setFilters({ ...filters, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="residential">Résidentiel</SelectItem>
                        <SelectItem value="office">Bureaux</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="vacant"
                      checked={filters.showVacant}
                      onCheckedChange={(c) => setFilters({ ...filters, showVacant: !!c })}
                    />
                    <label htmlFor="vacant" className="text-sm">
                      Afficher uniquement avec vacances
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-sm">Statistiques</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total unités</span>
                      <span className="font-medium">{filteredBuildings.reduce((sum, b) => sum + b.units, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Occupées</span>
                      <span className="font-medium text-success">{filteredBuildings.reduce((sum, b) => sum + b.occupied, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Vacantes</span>
                      <span className="font-medium text-warning">{filteredBuildings.reduce((sum, b) => sum + (b.units - b.occupied), 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Map Area with Building Cards */}
          <div className="flex-1">
            <div className="relative rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-secondary to-muted" style={{ minHeight: "600px" }}>
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A227' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>
              
              {/* Map Header */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <Card className="bg-card/95 backdrop-blur">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-primary" />
                      <span className="font-medium">Dakar, Sénégal</span>
                    </div>
                    <Badge variant="outline">{filteredBuildings.length} bâtiments</Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Building Pins Grid */}
              <div className="relative z-0 p-4 pt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBuildings.map((building, idx) => {
                  const occupancyRate = Math.round((building.occupied / building.units) * 100);
                  const isSelected = selectedBuilding?.id === building.id;
                  
                  return (
                    <Card 
                      key={building.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-scale-in ${isSelected ? 'ring-2 ring-primary shadow-xl' : ''}`}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                      onClick={() => setSelectedBuilding(isSelected ? null : building)}
                    >
                      <div className="relative h-32 overflow-hidden rounded-t-lg">
                        <img 
                          src={building.image} 
                          alt={building.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className={typeColors[building.type as keyof typeof typeColors]}>
                            {typeLabels[building.type as keyof typeof typeLabels]}
                          </Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="w-8 h-8 rounded-full bg-card/90 backdrop-blur flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-primary" />
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-1">{building.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                          <MapPin className="w-3 h-3" />
                          {building.address}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Occupation</span>
                            <span className="font-medium">{building.occupied}/{building.units}</span>
                          </div>
                          <Progress value={occupancyRate} className="h-2" />
                        </div>
                        {isSelected && (
                          <div className="mt-4 pt-4 border-t space-y-2 animate-fade-in">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div className="bg-secondary rounded-lg p-2 text-center">
                                <div className="font-bold text-primary">{occupancyRate}%</div>
                                <div className="text-xs text-muted-foreground">Taux</div>
                              </div>
                              <div className="bg-secondary rounded-lg p-2 text-center">
                                <div className="font-bold text-warning">{building.units - building.occupied}</div>
                                <div className="text-xs text-muted-foreground">Vacants</div>
                              </div>
                            </div>
                            <Button variant="gradient" className="w-full" size="sm" asChild>
                              <Link to={`/buildings/${building.id}`}>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir la fiche
                              </Link>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BuildingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        building={null}
      />
    </AppLayout>
  );
};

export default MapView;
