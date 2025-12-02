import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useData, Tenant, Payment } from "@/contexts/DataContext";
import { CreditCard, Smartphone, Banknote, Building } from "lucide-react";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant: Tenant | null;
}

const paymentMethods = [
  { id: "card", label: "Carte bancaire", icon: CreditCard },
  { id: "mobile", label: "Mobile Money", icon: Smartphone },
  { id: "transfer", label: "Virement", icon: Building },
  { id: "cash", label: "Espèces", icon: Banknote },
];

const PaymentModal = ({ open, onOpenChange, tenant }: PaymentModalProps) => {
  const { processPayment } = useData();
  const [amount, setAmount] = useState(tenant?.balance || tenant?.rent || 0);
  const [method, setMethod] = useState<Payment["method"]>("card");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async () => {
    if (!tenant) return;
    
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    processPayment(tenant.id, amount, method);
    setProcessing(false);
    onOpenChange(false);
  };

  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Tenant Info */}
          <div className="bg-secondary rounded-lg p-4">
            <p className="font-semibold">{tenant.name}</p>
            <p className="text-sm text-muted-foreground">{tenant.apartment} • {tenant.building}</p>
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Loyer mensuel</span>
                <span>{tenant.rent.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Solde dû</span>
                <span className="font-semibold text-destructive">{tenant.balance.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant du paiement (FCFA)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
              className="text-lg font-semibold"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(tenant.rent)}
              >
                1 mois
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAmount(tenant.balance)}
              >
                Solde total
              </Button>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Méthode de paiement</Label>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as Payment["method"])}>
              <div className="grid grid-cols-2 gap-3">
                {paymentMethods.map((m) => (
                  <div key={m.id}>
                    <RadioGroupItem
                      value={m.id}
                      id={m.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={m.id}
                      className="flex items-center gap-3 rounded-lg border-2 border-muted bg-card p-4 cursor-pointer hover:bg-secondary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all"
                    >
                      <m.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{m.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Card Details (shown for card payment) */}
          {method === "card" && (
            <div className="space-y-4 p-4 bg-secondary rounded-lg animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Numéro de carte</Label>
                <Input id="cardNumber" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiration</Label>
                  <Input id="expiry" placeholder="MM/AA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {method === "mobile" && (
            <div className="space-y-4 p-4 bg-secondary rounded-lg animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Numéro de téléphone</Label>
                <Input id="mobileNumber" placeholder="+221 77 XXX XX XX" />
              </div>
              <p className="text-xs text-muted-foreground">
                Un SMS de confirmation sera envoyé pour valider le paiement via Orange Money / Wave.
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
            Annuler
          </Button>
          <Button variant="gradient" onClick={handleSubmit} disabled={processing || amount <= 0}>
            {processing ? "Traitement..." : `Payer ${amount.toLocaleString()} FCFA`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
