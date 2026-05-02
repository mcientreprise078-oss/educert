import { AdminGuard } from "@/components/AdminGuard";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateDomain,
  useDeleteDomain,
  useListDomains,
  useUpdateDomain,
} from "@/lib/queries";
import type { Domain, DomainTier } from "@/lib/types";
import {
  Crown,
  FolderOpen,
  Info,
  Layers,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DomainFormState {
  name: string;
  description: string;
  tier: DomainTier;
  requiresManualApproval: boolean;
}

const EMPTY_FORM: DomainFormState = {
  name: "",
  description: "",
  tier: "standard",
  requiresManualApproval: false,
};

function DomainTierBadge({ tier }: { tier: DomainTier }) {
  if (tier === "vip") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
        <Crown className="size-3" />
        VIP
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
      <Layers className="size-3" />
      Standard
    </span>
  );
}

function DomainFormDialog({
  open,
  initial,
  onClose,
  onSubmit,
  isPending,
  title,
}: {
  open: boolean;
  initial: DomainFormState;
  onClose: () => void;
  onSubmit: (form: DomainFormState) => void;
  isPending: boolean;
  title: string;
}) {
  const [form, setForm] = useState<DomainFormState>(initial);

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Le nom du domaine est requis.");
      return;
    }
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-ocid="domains.dialog">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="domain-name">Nom du domaine *</Label>
            <Input
              id="domain-name"
              placeholder="ex. Comptabilité & Finance"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              data-ocid="domains.name_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="domain-desc">Description</Label>
            <Textarea
              id="domain-desc"
              placeholder="Brève description du domaine de formation..."
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              data-ocid="domains.description_input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Niveau</Label>
            <Select
              value={form.tier}
              onValueChange={(v) => setForm({ ...form, tier: v as DomainTier })}
            >
              <SelectTrigger data-ocid="domains.tier_select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="vip">VIP — Certification Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Certificat manuel requis
              </Label>
              <p className="text-xs text-muted-foreground">
                L'admin valide chaque certificat manuellement
              </p>
            </div>
            <Switch
              checked={form.requiresManualApproval}
              onCheckedChange={(v) =>
                setForm({ ...form, requiresManualApproval: v })
              }
              data-ocid="domains.manual_approval_switch"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-ocid="domains.cancel_button"
          >
            Annuler
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            data-ocid="domains.submit_button"
          >
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteConfirmDialog({
  domain,
  onConfirm,
  onCancel,
  isPending,
}: {
  domain: Domain;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="max-w-sm" data-ocid="domains.delete_dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-4" />
            Supprimer ce domaine
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Êtes-vous sûr de vouloir supprimer le domaine{" "}
          <span className="font-semibold text-foreground">{domain.name}</span> ?
          Cette action est irréversible.
        </p>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            data-ocid="domains.delete_cancel_button"
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isPending}
            data-ocid="domains.delete_confirm_button"
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDomainsPage() {
  const { data: domains = [], isLoading } = useListDomains();
  const createDomain = useCreateDomain();
  const updateDomain = useUpdateDomain();
  const deleteDomain = useDeleteDomain();

  const [showCreate, setShowCreate] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [deletingDomain, setDeletingDomain] = useState<Domain | null>(null);

  const handleCreate = (form: DomainFormState) => {
    createDomain.mutate(form, {
      onSuccess: () => {
        toast.success(`Domaine "${form.name}" créé avec succès`);
        setShowCreate(false);
      },
      onError: () => toast.error("Erreur lors de la création"),
    });
  };

  const handleUpdate = (form: DomainFormState) => {
    if (!editingDomain) return;
    updateDomain.mutate(
      {
        id: editingDomain.id,
        tier: form.tier,
        requiresManualApproval: form.requiresManualApproval,
        name: form.name,
        description: form.description,
      },
      {
        onSuccess: () => {
          toast.success(`Domaine "${form.name}" mis à jour`);
          setEditingDomain(null);
        },
        onError: () => toast.error("Erreur lors de la mise à jour"),
      },
    );
  };

  const handleDelete = () => {
    if (!deletingDomain) return;
    deleteDomain.mutate(
      { id: deletingDomain.id },
      {
        onSuccess: () => {
          toast.success("Domaine supprimé");
          setDeletingDomain(null);
        },
        onError: () => toast.error("Erreur lors de la suppression"),
      },
    );
  };

  const vipCount = domains.filter((d) => d.tier === "vip").length;
  const manualCount = domains.filter((d) => d.requiresManualApproval).length;

  return (
    <AdminGuard>
      <Layout>
        <div className="space-y-6" data-ocid="admin_domains.page">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  Administration
                </span>
              </div>
              <h1 className="font-display font-bold text-3xl text-foreground">
                Domaines de Formation
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Gérez les catégories VIP et Standard
              </p>
            </div>
            <Button
              onClick={() => setShowCreate(true)}
              className="gap-2 shrink-0"
              data-ocid="admin_domains.create_button"
            >
              <Plus className="size-4" />
              Nouveau Domaine
            </Button>
          </div>

          {/* Info banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <Info className="size-4 text-accent mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                Domaines VIP :
              </span>{" "}
              Les domaines VIP nécessitent une approbation manuelle avant la
              délivrance des certificats. Les apprenants reçoivent leur
              certificat uniquement après validation par l'administrateur.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Total domaines",
                value: domains.length,
                icon: FolderOpen,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Domaines VIP",
                value: vipCount,
                icon: Crown,
                color: "text-yellow-600",
                bg: "bg-yellow-100",
              },
              {
                label: "Approbation manuelle",
                value: manualCount,
                icon: ShieldCheck,
                color: "text-accent",
                bg: "bg-accent/10",
              },
            ].map((stat) => (
              <Card key={stat.label} className="border-border">
                <CardContent className="pt-4 px-4 pb-4">
                  <div
                    className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center mb-2`}
                  >
                    <stat.icon className={`size-4 ${stat.color}`} />
                  </div>
                  <p className="text-2xl font-bold font-display text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Domains table */}
          <Card data-ocid="admin_domains.table">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Liste des domaines
                {!isLoading && (
                  <Badge variant="secondary" className="ml-auto">
                    {domains.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Domaine
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Niveau
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Approbation manuelle
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i} className="border-b border-border">
                          {[1, 2, 3, 4].map((j) => (
                            <td key={j} className="px-4 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : domains.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4}
                          className="text-center py-12 text-muted-foreground"
                          data-ocid="admin_domains.empty_state"
                        >
                          <FolderOpen className="size-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">
                            Aucun domaine créé pour le moment
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 gap-1 text-primary"
                            onClick={() => setShowCreate(true)}
                          >
                            <Plus className="size-3" />
                            Créer le premier domaine
                          </Button>
                        </td>
                      </tr>
                    ) : (
                      domains.map((domain, idx) => (
                        <tr
                          key={String(domain.id)}
                          className="border-b border-border hover:bg-muted/20 transition-colors"
                          data-ocid={`admin_domains.item.${idx + 1}`}
                        >
                          {/* Domaine */}
                          <td className="px-4 py-3">
                            <div className="min-w-0">
                              <p className="font-medium text-foreground">
                                {domain.name}
                              </p>
                              {domain.description && (
                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                  {domain.description}
                                </p>
                              )}
                            </div>
                          </td>
                          {/* Niveau */}
                          <td className="px-4 py-3">
                            <DomainTierBadge tier={domain.tier} />
                          </td>
                          {/* Approbation manuelle */}
                          <td className="px-4 py-3">
                            {domain.requiresManualApproval ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                <ShieldCheck className="size-3" />
                                Oui
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                Non
                              </span>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 gap-1"
                                onClick={() => setEditingDomain(domain)}
                                data-ocid={`admin_domains.edit_button.${idx + 1}`}
                              >
                                <Pencil className="size-3" />
                                Éditer
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => setDeletingDomain(domain)}
                                data-ocid={`admin_domains.delete_button.${idx + 1}`}
                              >
                                <Trash2 className="size-3" />
                                Supprimer
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create dialog */}
        {showCreate && (
          <DomainFormDialog
            open={showCreate}
            initial={EMPTY_FORM}
            onClose={() => setShowCreate(false)}
            onSubmit={handleCreate}
            isPending={createDomain.isPending}
            title="Nouveau domaine de formation"
          />
        )}

        {/* Edit dialog */}
        {editingDomain && (
          <DomainFormDialog
            open={!!editingDomain}
            initial={{
              name: editingDomain.name,
              description: editingDomain.description,
              tier: editingDomain.tier,
              requiresManualApproval: editingDomain.requiresManualApproval,
            }}
            onClose={() => setEditingDomain(null)}
            onSubmit={handleUpdate}
            isPending={updateDomain.isPending}
            title={`Modifier : ${editingDomain.name}`}
          />
        )}

        {/* Delete confirmation */}
        {deletingDomain && (
          <DeleteConfirmDialog
            domain={deletingDomain}
            onConfirm={handleDelete}
            onCancel={() => setDeletingDomain(null)}
            isPending={deleteDomain.isPending}
          />
        )}
      </Layout>
    </AdminGuard>
  );
}
