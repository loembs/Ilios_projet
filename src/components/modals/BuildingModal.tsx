import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, Building } from "@/contexts/DataContext";

interface BuildingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  building?: Building | null;
}

const defaultImages = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop",
];

const BuildingModal = ({ open, onOpenChange, building }: BuildingModalProps) => {
  const { addBuilding, updateBuilding } = useData();
  const [form, setForm] = useState({
    name: "",
    address: "",
    type: "residential" as Building["type"],
    units: 0,
    occupied: 0,
    revenue: 0,
    floors: 1,
    yearBuilt: new Date().getFullYear(),
    image: defaultImages[0],
  });

  useEffect(() => {
    if (building) {
      setForm({
        name: building.name,
        address: building.address,
        type: building.type,
        units: building.units,
        occupied: building.occupied,
        revenue: building.revenue,
        floors: building.floors || 1,
        yearBuilt: building.yearBuilt || new Date().getFullYear(),
        image: building.image,
      });
    } else {
      setForm({
        name: "",
        address: "",
        type: "residential",
        units: 0,
        occupied: 0,
        revenue: 0,
        floors: 1,
        yearBuilt: new Date().getFullYear(),
        image: defaultImages[Math.floor(Math.random() * defaultImages.length)],
      });
    }
  }, [building, open]);

  const handleSubmit = () => {
    if (building) {
      updateBuilding(building.id, form);
    } else {
      addBuilding(form);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{building ? "Modifier le bâtiment" : "Nouveau bâtiment"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du bâtiment</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Résidence Example"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="123 Rue Example, Dakar"
            />
          </div>

          <div className="space-y-2">
            <Label>Type de bâtiment</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Building["type"] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Résidentiel</SelectItem>
                <SelectItem value="office">Bureaux</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="units">Nombre d'unités</Label>
              <Input
                id="units"
                type="number"
                value={form.units}
                onChange={(e) => setForm({ ...form, units: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="floors">Étages</Label>
              <Input
                id="floors"
                type="number"
                value={form.floors}
                onChange={(e) => setForm({ ...form, floors: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Revenus mensuels (FCFA)</Label>
              <Input
                id="revenue"
                type="number"
                value={form.revenue}
                onChange={(e) => setForm({ ...form, revenue: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Année de construction</Label>
              <Input
                id="yearBuilt"
                type="number"
                value={form.yearBuilt}
                onChange={(e) => setForm({ ...form, yearBuilt: parseInt(e.target.value) || 2020 })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="gradient" onClick={handleSubmit}>
            {building ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuildingModal;
