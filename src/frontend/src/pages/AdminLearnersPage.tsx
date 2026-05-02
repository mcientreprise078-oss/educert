import { AdminGuard } from "@/components/AdminGuard";
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGenerateInactivityNotifications,
  useGetEnrollments,
  useGetMyNotifications,
} from "@/lib/queries";
import type { Enrollment } from "@/lib/types";
import {
  Activity,
  Bell,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type LearnerFilter = "tous" | "inactifs" | "en_cours" | "termines";

interface LearnerStats {
  learnerId: string;
  name: string;
  email: string;
  enrollments: Enrollment[];
  avgProgress: number;
  lastActivity: number;
  status: "actif" | "inactif" | "termine";
  coursesCompleted: number;
  totalCourses: number;
}

function getLearnerName(learnerId: string): string {
  const names: Record<string, string> = {
    u1: "Sophie Martin",
    u2: "Thomas Dubois",
    u3: "Clara Bernard",
    u4: "Lucas Petit",
    u5: "Emma Robert",
    u6: "Pierre Dupont",
    u7: "Julie Moreau",
    u8: "Antoine Lefebvre",
    u9: "Marie Simon",
    u10: "Nicolas Garcia",
    user1: "Alexandre Martin",
  };
  return names[learnerId] ?? `Apprenant ${learnerId}`;
}

function getLearnerEmail(learnerId: string): string {
  const first = getLearnerName(learnerId).split(" ")[0].toLowerCase();
  return `${first}.${learnerId}@educert.cd`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return "il y a moins d'1h";
  if (h < 24) return `il y a ${h}h`;
  if (d === 1) return "hier";
  if (d < 7) return `il y a ${d} jours`;
  const w = Math.floor(d / 7);
  return `il y a ${w} sem.`;
}

function buildLearnerStats(enrollments: Enrollment[]): LearnerStats[] {
  const byLearner: Record<string, Enrollment[]> = {};
  for (const e of enrollments) {
    if (!byLearner[e.learnerId]) byLearner[e.learnerId] = [];
    byLearner[e.learnerId].push(e);
  }

  return Object.entries(byLearner).map(([learnerId, enrs]) => {
    const avgProgress = Math.round(
      enrs.reduce((sum, e) => sum + e.progress, 0) / enrs.length,
    );
    // Use most recent enrolledAt as proxy for last activity
    const lastActivity = Math.max(...enrs.map((e) => e.enrolledAt));
    const coursesCompleted = enrs.filter((e) => e.completedAt != null).length;
    const allCompleted = coursesCompleted === enrs.length && enrs.length > 0;
    const isInactive = Date.now() - lastActivity > 86400000;

    let status: LearnerStats["status"] = "actif";
    if (allCompleted) status = "termine";
    else if (isInactive) status = "inactif";

    return {
      learnerId,
      name: getLearnerName(learnerId),
      email: getLearnerEmail(learnerId),
      enrollments: enrs,
      avgProgress,
      lastActivity,
      status,
      coursesCompleted,
      totalCourses: enrs.length,
    };
  });
}

const STATUS_BADGE: Record<
  LearnerStats["status"],
  { label: string; className: string }
> = {
  actif: {
    label: "Actif",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  inactif: {
    label: "Inactif",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  termine: {
    label: "Terminé",
    className: "bg-accent/10 text-accent border-accent/20",
  },
};

function LearnerRowSkeleton() {
  return (
    <tr className="border-b border-border">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

function LearnerDetailDrawer({
  learner,
  onClose,
}: { learner: LearnerStats; onClose: () => void }) {
  const sendNotification = useGenerateInactivityNotifications();

  const handleSendNotification = () => {
    sendNotification.mutate(undefined, {
      onSuccess: () => toast.success(`Notification envoyée à ${learner.name}`),
      onError: () => toast.error("Erreur lors de l'envoi"),
    });
  };

  const courseNames: Record<string, string> = {
    "1": "Gestion Avancée de Projets",
    "2": "Introduction à la Data Science",
    "3": "Leadership Authentique",
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="learner_detail.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-base">Profil de l'apprenant</DialogTitle>
        </DialogHeader>

        {/* Profile header */}
        <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl">
          <Avatar className="h-14 w-14 border-2 border-border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
              {getInitials(learner.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-foreground text-base">
              {learner.name}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {learner.email}
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  STATUS_BADGE[learner.status].className
                }`}
              >
                {STATUS_BADGE[learner.status].label}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarDays className="size-3" />
                Inscrit{" "}
                {relativeTime(
                  Math.min(...learner.enrollments.map((e) => e.enrolledAt)),
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Per-course progress */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Activity className="size-4 text-accent" />
            Progression par cours
          </h3>
          {learner.enrollments.map((enr, idx) => (
            <div
              key={enr.id}
              className="p-3 rounded-lg border border-border bg-card"
              data-ocid={`learner_detail.course_item.${idx + 1}`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground truncate">
                  {courseNames[enr.courseId] ?? `Cours ${enr.courseId}`}
                </p>
                <span className="text-xs font-bold text-primary ml-2 shrink-0">
                  {enr.progress}%
                </span>
              </div>
              <Progress value={enr.progress} className="h-1.5" />
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>{enr.completedLessons.length} leçons complétées</span>
                <span>Inscrit {relativeTime(enr.enrolledAt)}</span>
              </div>
              {enr.completedAt && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-primary">
                  <CheckCircle2 className="size-3" />
                  Terminé {relativeTime(enr.completedAt)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Activity timeline */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
            <Clock className="size-4 text-accent" />
            Activité récente
          </h3>
          <div className="space-y-2">
            {learner.enrollments.slice(0, 5).map((enr) => (
              <div
                key={String(enr.courseId)}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0" />
                <span className="flex-1">
                  Leçon complétée dans{" "}
                  <span className="text-foreground font-medium">
                    {courseNames[enr.courseId] ?? `Cours ${enr.courseId}`}
                  </span>
                </span>
                <span className="text-xs shrink-0">
                  {relativeTime(enr.enrolledAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Send notification */}
        <Button
          onClick={handleSendNotification}
          disabled={sendNotification.isPending}
          className="w-full gap-2"
          data-ocid="learner_detail.send_notification_button"
        >
          <Bell className="size-4" />
          {sendNotification.isPending
            ? "Envoi en cours..."
            : "Envoyer une notification"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminLearnersPage() {
  const { data: enrollments = [], isLoading } = useGetEnrollments();
  const generateNotifications = useGenerateInactivityNotifications();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<LearnerFilter>("tous");
  const [selectedLearner, setSelectedLearner] = useState<LearnerStats | null>(
    null,
  );
  const [notifSentCount, setNotifSentCount] = useState<number | null>(null);

  const allLearners = useMemo(
    () => buildLearnerStats(enrollments),
    [enrollments],
  );

  const filtered = useMemo(() => {
    let list = allLearners;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(q));
    }
    if (filter === "inactifs")
      list = list.filter((l) => l.status === "inactif");
    else if (filter === "en_cours")
      list = list.filter((l) => l.status === "actif");
    else if (filter === "termines")
      list = list.filter((l) => l.status === "termine");
    return list;
  }, [allLearners, search, filter]);

  const inactiveCount = allLearners.filter(
    (l) => l.status === "inactif",
  ).length;

  const handleIABooster = () => {
    generateNotifications.mutate(undefined, {
      onSuccess: (count) => {
        const n = Number(count);
        setNotifSentCount(n);
        toast.success(
          `IA Booster : ${n} rappel${n !== 1 ? "s" : ""} envoyé${n !== 1 ? "s" : ""} aux apprenants inactifs`,
        );
      },
      onError: () => toast.error("Erreur lors de l'envoi des rappels IA"),
    });
  };

  return (
    <AdminGuard>
      <Layout>
        <div className="space-y-6" data-ocid="admin_learners.page">
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
                Suivi des Apprenants
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Surveillance de la progression de chaque étudiant
              </p>
            </div>

            {/* IA Booster */}
            <div className="flex flex-col items-end gap-2">
              <Button
                onClick={handleIABooster}
                disabled={generateNotifications.isPending}
                className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
                data-ocid="admin_learners.ia_booster_button"
              >
                <Bot className="size-4" />
                {generateNotifications.isPending
                  ? "Analyse en cours..."
                  : "IA Booster — Envoyer rappels"}
              </Button>
              {inactiveCount > 0 && (
                <p className="text-xs text-destructive font-medium">
                  {inactiveCount} apprenant{inactiveCount > 1 ? "s" : ""}{" "}
                  inactif
                  {inactiveCount > 1 ? "s" : ""} (24h+)
                </p>
              )}
              {notifSentCount !== null && (
                <p className="text-xs text-primary font-medium">
                  ✓ {notifSentCount} rappel{notifSentCount !== 1 ? "s" : ""}{" "}
                  envoyé
                  {notifSentCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: "Total apprenants",
                value: allLearners.length,
                icon: Users,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Actifs",
                value: allLearners.filter((l) => l.status === "actif").length,
                icon: CheckCircle2,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Inactifs (24h+)",
                value: inactiveCount,
                icon: XCircle,
                color: "text-destructive",
                bg: "bg-destructive/10",
              },
              {
                label: "Terminés",
                value: allLearners.filter((l) => l.status === "termine").length,
                icon: CheckCircle2,
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un apprenant..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-ocid="admin_learners.search_input"
              />
            </div>
            <Select
              value={filter}
              onValueChange={(v) => setFilter(v as LearnerFilter)}
            >
              <SelectTrigger
                className="w-full sm:w-52"
                data-ocid="admin_learners.filter_select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les apprenants</SelectItem>
                <SelectItem value="inactifs">Inactifs (24h+)</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="termines">Terminés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Learners table */}
          <Card data-ocid="admin_learners.table">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Apprenants inscrits
                {!isLoading && (
                  <Badge variant="secondary" className="ml-auto">
                    {filtered.length}
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
                        Apprenant
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Cours inscrits
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Dernier accès
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Progression
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Statut
                      </th>
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      [1, 2, 3, 4, 5].map((i) => <LearnerRowSkeleton key={i} />)
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-12 text-muted-foreground"
                          data-ocid="admin_learners.empty_state"
                        >
                          <Users className="size-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">
                            Aucun apprenant inscrit pour le moment
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((learner, idx) => (
                        <tr
                          key={learner.learnerId}
                          className="border-b border-border hover:bg-muted/20 transition-colors cursor-pointer"
                          onClick={() => setSelectedLearner(learner)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && setSelectedLearner(learner)
                          }
                          data-ocid={`admin_learners.item.${idx + 1}`}
                        >
                          {/* Apprenant */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                  {getInitials(learner.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {learner.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {learner.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* Cours inscrits */}
                          <td className="px-4 py-3">
                            <span className="text-foreground font-medium">
                              {learner.totalCourses}
                            </span>
                            {learner.coursesCompleted > 0 && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({learner.coursesCompleted} terminé
                                {learner.coursesCompleted > 1 ? "s" : ""})
                              </span>
                            )}
                          </td>
                          {/* Dernier accès */}
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs ${
                                learner.status === "inactif"
                                  ? "text-destructive font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {relativeTime(learner.lastActivity)}
                            </span>
                          </td>
                          {/* Progression */}
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 min-w-[100px]">
                              <Progress
                                value={learner.avgProgress}
                                className="h-1.5 flex-1"
                              />
                              <span className="text-xs font-medium text-foreground w-8 text-right">
                                {learner.avgProgress}%
                              </span>
                            </div>
                          </td>
                          {/* Statut */}
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                                STATUS_BADGE[learner.status].className
                              }`}
                            >
                              {STATUS_BADGE[learner.status].label}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs h-7 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLearner(learner);
                              }}
                              data-ocid={`admin_learners.detail_button.${idx + 1}`}
                            >
                              Détails
                            </Button>
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

        {/* Learner detail drawer */}
        {selectedLearner && (
          <LearnerDetailDrawer
            learner={selectedLearner}
            onClose={() => setSelectedLearner(null)}
          />
        )}
      </Layout>
    </AdminGuard>
  );
}
