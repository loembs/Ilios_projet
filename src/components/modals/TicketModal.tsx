import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useData, Ticket } from "@/contexts/DataContext";

interface TicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket?: Ticket | null;
}

const technicians = ["Ahmed Diallo", "Moussa Fall", "Ibrahim Ndiaye", "Fatou Diop"];

const TicketModal = ({ open, onOpenChange, ticket }: TicketModalProps) => {
  const { addTicket, updateTicket, buildings, tenants } = useData();
  const [form, setForm] = useState({
    title: "",
    description: "",
    building: "",
    apartment: "",
    priority: "medium" as Ticket["priority"],
    status: "new" as Ticket["status"],
    assignee: "",
    tenant: "",
    createdAt: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (ticket) {
      setForm({
        title: ticket.title,
        description: ticket.description,
        building: ticket.building,
        apartment: ticket.apartment,
        priority: ticket.priority,
        status: ticket.status,
        assignee: ticket.assignee || "",
        tenant: ticket.tenant,
        createdAt: ticket.createdAt,
      });
    } else {
      setForm({
        title: "",
        description: "",
        building: buildings[0]?.name || "",
        apartment: "",
        priority: "medium",
        status: "new",
        assignee: "",
        tenant: tenants[0]?.name || "",
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
  }, [ticket, open, buildings, tenants]);

  const handleSubmit = () => {
    const ticketData = {
      ...form,
      assignee: form.assignee || undefined,
    };
    
    if (ticket) {
      updateTicket(ticket.id, ticketData);
    } else {
      addTicket(ticketData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{ticket ? `Modifier ${ticket.id}` : "Nouveau ticket"}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Décrivez le problème"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Détails du problème..."
              rows={3}
            />
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
              <Label>Priorité</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Ticket["priority"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Ticket["status"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="waiting">En attente</SelectItem>
                  <SelectItem value="resolved">Résolu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Locataire concerné</Label>
            <Select value={form.tenant} onValueChange={(v) => setForm({ ...form, tenant: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((t) => (
                  <SelectItem key={t.id} value={t.name}>{t.name} - {t.apartment}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Technicien assigné</Label>
            <Select value={form.assignee} onValueChange={(v) => setForm({ ...form, assignee: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Non assigné" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Non assigné</SelectItem>
                {technicians.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button variant="gradient" onClick={handleSubmit}>
            {ticket ? "Enregistrer" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TicketModal;
