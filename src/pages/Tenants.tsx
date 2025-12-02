import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  DropdownMenuSeparator,
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
import { Search, Plus, Mail, Phone, Building, Calendar, FileText, MoreHorizontal, Edit, Trash2, CreditCard, Bell } from "lucide-react";
import { useData, Tenant } from "@/contexts/DataContext";
import TenantModal from "@/components/modals/TenantModal";
import PaymentModal from "@/components/modals/PaymentModal";

const statusColors = {
  active: "bg-success text-success-foreground",
  expiring: "bg-warning text-warning-foreground",
  ended: "bg-muted text-muted-foreground",
};

const statusLabels = {
  active: "Actif",
  expiring: "Expire bientôt",
  ended: "Terminé",
};

const Tenants = () => {
  const { tenants, deleteTenant, sendNotification } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editTenant, setEditTenant] = useState<Tenant | null>(null);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleEdit = (tenant: Tenant) => {
    setEditTenant(tenant);
    setModalOpen(true);
  };

  const handlePayment = (tenant: Tenant) => {
    setSelectedTenant(tenant);
    setPaymentModalOpen(true);
  };

  const handleDelete = (tenant: Tenant) => {
    setTenantToDelete(tenant);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tenantToDelete) {
      deleteTenant(tenantToDelete.id);
    }
    setDeleteDialogOpen(false);
    setTenantToDelete(null);
  };

  const handleSendReminder = (tenant: Tenant) => {
    sendNotification(tenant.id, "payment_reminder");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Locataires</h1>
            <p className="text-muted-foreground">{filteredTenants.length} locataires dans votre portefeuille</p>
          </div>
          <Button variant="gradient" onClick={() => { setEditTenant(null); setModalOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un locataire
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total locataires</p>
              <p className="text-2xl font-bold">{tenants.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Contrats actifs</p>
              <p className="text-2xl font-bold text-success">{tenants.filter(t => t.status === "active").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Expire bientôt</p>
              <p className="text-2xl font-bold text-warning">{tenants.filter(t => t.status === "expiring").length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Impayés</p>
              <p className="text-2xl font-bold text-destructive">{tenants.filter(t => !t.paid).length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un locataire..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="expiring">Expire bientôt</SelectItem>
              <SelectItem value="ended">Terminés</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locataire</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Logement</TableHead>
                <TableHead>Loyer</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {tenant.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{tenant.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Depuis {new Date(tenant.startDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <Mail className="w-3 h-3 text-muted-foreground" />
                        {tenant.email}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="w-3 h-3 text-muted-foreground" />
                        {tenant.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{tenant.apartment}</p>
                        <p className="text-xs text-muted-foreground">{tenant.building}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {tenant.rent.toLocaleString()} FCFA
                  </TableCell>
                  <TableCell>
                    <Badge className={tenant.paid ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}>
                      {tenant.paid ? "Payé" : `Dû: ${tenant.balance.toLocaleString()}`}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[tenant.status as keyof typeof statusColors]}>
                      {statusLabels[tenant.status as keyof typeof statusLabels]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(tenant)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePayment(tenant)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Enregistrer paiement
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendReminder(tenant)}>
                          <Bell className="w-4 h-4 mr-2" />
                          Envoyer rappel
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          Voir contrat
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(tenant)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <TenantModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tenant={editTenant}
      />

      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        tenant={selectedTenant}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le locataire ?</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer "{tenantToDelete?.name}" ? Cette action est irréversible.
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

export default Tenants;
