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
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveGeneration,
  useListAllGenerations,
  useRejectGeneration,
} from "@/lib/queries";
import type { CourseGeneration, GenerationStatus } from "@/lib/types";
import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Clock,
  FileText,
  Loader2,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ApprovalTab = "pending" | "approved" | "rejected" | "revision";

const TAB_CONFIG: Array<{
  value: ApprovalTab;
  label: string;
  statuses: GenerationStatus[];
}> = [
  { value: "pending", label: "En attente", statuses: ["step3_gpt4o"] },
  { value: "approved", label: "Approuvés", statuses: ["approved"] },
  { value: "rejected", label: "Rejetés", statuses: ["rejected"] },
  {
    value: "revision",
    label: "Révision demandée",
    statuses: ["revision_needed"],
  },
];

const anonymizeLearner = (id: string) => {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `Apprenant #${(hash % 9000) + 1000}`;
};

function RejectDialog({
  gen,
  open,
  onClose,
}: {
  gen: CourseGeneration | null;
  open: boolean;
  onClose: () => void;
}) {
  const rejectGeneration = useRejectGeneration();
  const [reason, setReason] = useState("");

  const handleReject = () => {
    if (!gen) return;
    if (!reason.trim()) {
      toast.error("Veuillez indiquer la raison du rejet");
      return;
    }
    rejectGeneration.mutate(
      { id: gen.id, reason },
      {
        onSuccess: () => {
          toast.success("Cours rejeté");
          setReason("");
          onClose();
        },
        onError: () => toast.error("Erreur lors du rejet"),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setReason("");
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-md"
        data-ocid="admin_approvals.reject_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="size-5 text-destructive" />
            Rejeter le cours
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {gen && (
            <p className="text-sm text-muted-foreground line-clamp-2 p-3 bg-muted/40 rounded-lg">
              {gen.requestDescription}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="reject-reason">Motif du rejet *</Label>
            <Textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez clairement pourquoi ce cours est rejeté..."
              rows={4}
              className="resize-none"
              data-ocid="admin_approvals.reject_reason_textarea"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setReason("");
              onClose();
            }}
            data-ocid="admin_approvals.reject_cancel_button"
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={rejectGeneration.isPending}
            data-ocid="admin_approvals.reject_confirm_button"
          >
            {rejectGeneration.isPending
              ? "Rejet en cours..."
              : "Confirmer le rejet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RevisionDialog({
  gen,
  open,
  onClose,
}: {
  gen: CourseGeneration | null;
  open: boolean;
  onClose: () => void;
}) {
  const rejectGeneration = useRejectGeneration();
  const [notes, setNotes] = useState("");

  const handleRevision = () => {
    if (!gen) return;
    if (!notes.trim()) {
      toast.error("Veuillez indiquer les points à réviser");
      return;
    }
    rejectGeneration.mutate(
      { id: gen.id, reason: `[RÉVISION] ${notes}` },
      {
        onSuccess: () => {
          toast.success("Demande de révision envoyée");
          setNotes("");
          onClose();
        },
        onError: () => toast.error("Erreur lors de la demande"),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setNotes("");
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-md"
        data-ocid="admin_approvals.revision_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="size-5 text-accent" />
            Demander une révision
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {gen && (
            <div className="p-3 bg-muted/40 rounded-lg">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {gen.requestDescription}
              </p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="revision-notes">Points à réviser *</Label>
            <Textarea
              id="revision-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Indiquez les sections à améliorer, les corrections à apporter..."
              rows={4}
              className="resize-none"
              data-ocid="admin_approvals.revision_notes_textarea"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setNotes("");
              onClose();
            }}
            data-ocid="admin_approvals.revision_cancel_button"
          >
            Annuler
          </Button>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleRevision}
            disabled={rejectGeneration.isPending}
            data-ocid="admin_approvals.revision_confirm_button"
          >
            {rejectGeneration.isPending ? "Envoi..." : "Envoyer la demande"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApproveDialog({
  gen,
  open,
  onClose,
}: {
  gen: CourseGeneration | null;
  open: boolean;
  onClose: () => void;
}) {
  const approveGeneration = useApproveGeneration();
  const [notes, setNotes] = useState("");

  const handleApprove = () => {
    if (!gen) return;
    approveGeneration.mutate(
      { id: gen.id, notes },
      {
        onSuccess: () => {
          toast.success("Cours approuvé et publié officiellement");
          setNotes("");
          onClose();
        },
        onError: () => toast.error("Erreur lors de l'approbation"),
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setNotes("");
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-w-md"
        data-ocid="admin_approvals.approve_dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="size-5 text-primary" />
            Approuver et publier
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          {gen && (
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <p className="text-sm font-medium text-foreground line-clamp-2">
                {gen.requestDescription}
              </p>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            En approuvant ce cours, vous certifiez qu'il respecte les standards
            pédagogiques du Ministère de la Formation Professionnelle de la RDC.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="approve-notes">Notes du réviseur (optionnel)</Label>
            <Textarea
              id="approve-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Commentaires, félicitations ou recommandations..."
              rows={3}
              className="resize-none"
              data-ocid="admin_approvals.approve_notes_textarea"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setNotes("");
              onClose();
            }}
            data-ocid="admin_approvals.approve_cancel_button"
          >
            Annuler
          </Button>
          <Button
            onClick={handleApprove}
            disabled={approveGeneration.isPending}
            data-ocid="admin_approvals.approve_confirm_button"
          >
            {approveGeneration.isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Publication...
              </>
            ) : (
              <>
                <CheckCircle className="size-4 mr-2" />
                Approuver et publier
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApprovalCard({
  gen,
  index,
  tab,
  onApprove,
  onReject,
  onRevision,
}: {
  gen: CourseGeneration;
  index: number;
  tab: ApprovalTab;
  onApprove: (gen: CourseGeneration) => void;
  onReject: (gen: CourseGeneration) => void;
  onRevision: (gen: CourseGeneration) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isPending = tab === "pending";

  const gpt4oStep = gen.steps.find((s) => s.model === "gpt4o");
  const validationExcerpt =
    gpt4oStep?.output ?? "Validation GPT-4o en attente...";

  const mockLessons = [
    "Introduction et objectifs de la formation",
    "Cadre conceptuel et notions fondamentales",
    "Applications pratiques et études de cas",
  ];

  return (
    <Card
      className={`border-border transition-smooth ${isPending ? "ring-1 ring-primary/20" : ""}`}
      data-ocid={`admin_approvals.item.${index + 1}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isPending
                ? "bg-primary/10"
                : tab === "approved"
                  ? "bg-primary/10"
                  : "bg-muted"
            }`}
          >
            {isPending ? (
              <Clock className="size-4 text-primary" />
            ) : tab === "approved" ? (
              <CheckCircle className="size-4 text-primary" />
            ) : tab === "rejected" ? (
              <XCircle className="size-4 text-destructive" />
            ) : (
              <RefreshCw className="size-4 text-accent" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-semibold text-foreground line-clamp-2 mb-2">
              {gen.requestDescription}
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {anonymizeLearner(gen.requestedBy)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {new Date(gen.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="size-3" />
                {gen.resourceIds.length} ressource
                {gen.resourceIds.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground shrink-0"
            onClick={() => setExpanded((p) => !p)}
            data-ocid={`admin_approvals.expand_button.${index + 1}`}
          >
            {expanded ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-muted/40 border border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Validation GPT-4o
          </p>
          <p className="text-xs text-foreground line-clamp-2">
            {validationExcerpt}
          </p>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 pb-4">
          <div className="border-t border-border pt-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Notes complètes de validation GPT-4o
              </p>
              <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
                {gen.steps.map((step) => (
                  <div key={step.step} className="mb-2 last:mb-0">
                    <span className="text-xs font-medium text-foreground">
                      {step.model === "deepseek"
                        ? "DeepSeek"
                        : step.model === "qwen"
                          ? "Qwen"
                          : "GPT-4o"}{" "}
                      :
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      {step.output ?? "En attente"}
                    </span>
                  </div>
                ))}
                {gen.steps.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Aucune sortie IA disponible.
                  </p>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Aperçu de la structure (3 premières leçons)
              </p>
              <div className="space-y-1.5">
                {mockLessons.map((lesson, i) => (
                  <div
                    key={lesson}
                    className="flex items-center gap-2 text-xs text-foreground p-2 rounded bg-card border border-border/50"
                  >
                    <span className="size-5 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center font-bold shrink-0">
                      {i + 1}
                    </span>
                    {lesson}
                  </div>
                ))}
              </div>
            </div>

            {gen.resourceIds.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Ressources citées ({gen.resourceIds.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {gen.resourceIds.map((rid) => (
                    <Badge
                      key={rid}
                      variant="outline"
                      className="text-xs gap-1"
                    >
                      <BookOpen className="size-2.5" />
                      {rid}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {(tab === "rejected" || tab === "revision") && gen.errorMessage && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-xs font-medium text-destructive mb-1">
                  {tab === "rejected" ? "Motif du rejet" : "Points à réviser"}
                </p>
                <p className="text-xs text-foreground">{gen.errorMessage}</p>
              </div>
            )}
          </div>
        </CardContent>
      )}

      {isPending && (
        <CardContent className="pt-0 pb-4">
          <div className="flex gap-3 pt-2 border-t border-border">
            <Button
              className="flex-1 gap-2"
              onClick={() => onApprove(gen)}
              data-ocid={`admin_approvals.approve_button.${index + 1}`}
            >
              <CheckCircle className="size-4" />
              Approuver et publier
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-accent/30 text-accent hover:bg-accent/5 hover:text-accent"
              onClick={() => onRevision(gen)}
              data-ocid={`admin_approvals.revision_button.${index + 1}`}
            >
              <RefreshCw className="size-4" />
              Révision
            </Button>
            <Button
              variant="outline"
              className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => onReject(gen)}
              data-ocid={`admin_approvals.reject_button.${index + 1}`}
            >
              <XCircle className="size-4" />
              Rejeter
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

export default function AdminApprovalsPage() {
  const { data: generations = [], isLoading } = useListAllGenerations();
  const [activeTab, setActiveTab] = useState<ApprovalTab>("pending");
  const [approveTarget, setApproveTarget] = useState<CourseGeneration | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<CourseGeneration | null>(
    null,
  );
  const [revisionTarget, setRevisionTarget] = useState<CourseGeneration | null>(
    null,
  );

  const getTabCount = (tab: ApprovalTab) => {
    const config = TAB_CONFIG.find((t) => t.value === tab);
    if (!config) return 0;
    return generations.filter((g) => config.statuses.includes(g.status)).length;
  };

  const currentTabStatuses =
    TAB_CONFIG.find((t) => t.value === activeTab)?.statuses ?? [];
  const filteredGenerations = generations.filter((g) =>
    currentTabStatuses.includes(g.status),
  );

  const pendingCount = getTabCount("pending");

  return (
    <AdminGuard>
      <Layout>
        <div className="space-y-6" data-ocid="admin_approvals.page">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display font-bold text-2xl text-foreground">
                  Approbations en attente
                </h1>
                {pendingCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs font-bold"
                    data-ocid="admin_approvals.pending_count_badge"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm">
                Validez les cours générés par l'IA avant leur publication
                officielle.
              </p>
            </div>
          </div>

          <div
            className="flex gap-1 p-1 bg-muted/50 rounded-xl w-full sm:w-auto sm:inline-flex"
            data-ocid="admin_approvals.tabs"
          >
            {TAB_CONFIG.map(({ value, label }) => {
              const count = getTabCount(value);
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`flex-1 sm:flex-none flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-smooth ${
                    activeTab === value
                      ? "bg-card shadow-sm text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`admin_approvals.tab_${value}`}
                >
                  {label}
                  {count > 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                        activeTab === value
                          ? value === "pending"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div
              className="space-y-4"
              data-ocid="admin_approvals.loading_state"
            >
              {(["a", "b"] as const).map((k) => (
                <Card key={k}>
                  <CardContent className="pt-5 pb-5">
                    <div className="flex items-start gap-3">
                      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-3" />
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGenerations.length === 0 ? (
            <Card>
              <CardContent
                className="flex flex-col items-center justify-center py-16"
                data-ocid="admin_approvals.empty_state"
              >
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                  <ClipboardCheck className="size-8 text-muted-foreground" />
                </div>
                <p className="font-display font-semibold text-foreground text-lg mb-2">
                  {activeTab === "pending"
                    ? "Aucun cours en attente"
                    : activeTab === "approved"
                      ? "Aucun cours approuvé"
                      : activeTab === "rejected"
                        ? "Aucun cours rejeté"
                        : "Aucune révision demandée"}
                </p>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  {activeTab === "pending"
                    ? "Les cours validés par GPT-4o apparaîtront ici pour approbation ministérielle."
                    : "Aucune entrée dans cette catégorie pour le moment."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredGenerations.map((gen, i) => (
                <ApprovalCard
                  key={gen.id}
                  gen={gen}
                  index={i}
                  tab={activeTab}
                  onApprove={setApproveTarget}
                  onReject={setRejectTarget}
                  onRevision={setRevisionTarget}
                />
              ))}
            </div>
          )}
        </div>

        <ApproveDialog
          gen={approveTarget}
          open={!!approveTarget}
          onClose={() => setApproveTarget(null)}
        />
        <RejectDialog
          gen={rejectTarget}
          open={!!rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
        <RevisionDialog
          gen={revisionTarget}
          open={!!revisionTarget}
          onClose={() => setRevisionTarget(null)}
        />
      </Layout>
    </AdminGuard>
  );
}
