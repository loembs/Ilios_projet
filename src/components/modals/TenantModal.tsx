import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, Tenant } from "@/contexts/DataContext";

interface TenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: Tenant | null;
}

const TenantModal = ({ open, onOpenChange, tenant }: TenantModalProps) => {
  const { addTenant, updateTenant, buildings } = useData();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    building: "",
    apartment: "",
    rent: 0,
    startDate: new Date().toISOString().split('T')[0],
    status: "active" as Tenant["status"],
    paid: true,
    balance: 0,
  });

  useEffect(() => {
    if (tenant) {
      setForm({
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        building: tenant.building,
        apartment: tenant.apartment,
        rent: tenant.rent,
        startDate: tenant.startDate,
        status: tenant.status,
        paid: tenant.paid,
        balance: tenant.balance,
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "+221 77 ",
        building: buildings[0]?.name || "",
        apartment: "",
        rent: 0,
        startDate: new Date().toISOString().split('T')[0],
        status: "active",
        paid: true,
        balance: 0,
      });
    }
  }, [tenant, open, buildings]);

  const handleSubmit = () => {
    if (tenant) {
      updateTenant(tenant.id, form);
    } else {
      addTenant(form);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{tenant ? "Modifier le locataire" : "Nouveau locataire"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Jean Dupont"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+221 77 123 4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bâtiment</Label>
              <Select value={form.building} onValueChange={(v) => setForm({ ...form, building: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((b) => (
                    <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apartment">Appartement</Label>
              <Input
                id="apartment"
                value={form.apartment}
                onChange={(e) => setForm({ ...form, apartment: e.target.value })}
                placeholder="Apt 101"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Loyer mensuel (FCFA)</Label>
              <Input
                id="rent"
                type="number"
                value={form.rent}
                onChange={(e) => setForm({ ...form, rent: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Statut du contrat</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Tenant["status"] })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expiring">Expire bientôt</SelectItem>
                <SelectItem value="ended">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="gradient" onClick={handleSubmit}>
            {tenant ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TenantModal;
