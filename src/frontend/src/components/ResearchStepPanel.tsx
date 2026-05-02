import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { RESEARCH_STEP_LABELS, RESEARCH_STEP_ORDER } from "@/lib/constants";
import { useSendResearchMessage, useValidateResearchStep } from "@/lib/queries";
import type {
  ResearchProject,
  ResearchStep,
  ResearchStepData,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  BookMarked,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Loader2,
  Lock,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STEP_PLACEHOLDERS: Record<ResearchStep, string> = {
  sujet:
    "Décrivez votre sujet de recherche (domaine, contexte, intérêt scientifique)…",
  problematique:
    "Quelle est la question centrale de votre recherche ? Pourquoi ce problème mérite-t-il d'être étudié ?",
  hypotheses:
    "Formulez vos hypothèses de travail. Que pensez-vous trouver comme résultats ?",
  methodologie:
    "Décrivez votre approche : qualitative, quantitative ou mixte ? Quels outils de collecte ?",
  plan: "Votre plan est généré automatiquement. Validez pour accéder à la rédaction finale.",
  redaction:
    "Demandez à l'IA de développer une section, ou posez des questions sur votre rédaction…",
};

const STEP_DESCRIPTIONS: Record<ResearchStep, string> = {
  sujet:
    "Présentez votre sujet à votre Directeur de Recherche IA. Il vous aidera à le délimiter et valider scientifiquement.",
  problematique:
    "Formulez la question centrale. L'IA vérifie sa pertinence et sa conformité aux normes académiques.",
  hypotheses:
    "Proposez vos hypothèses. Votre Directeur les évaluera et vous orientera sur leur validité scientifique.",
  methodologie:
    "Décrivez votre approche. L'IA valide la cohérence avec votre problématique et vos objectifs.",
  plan: "L'IA génère un plan détaillé basé sur vos échanges. Validez-le pour commencer la rédaction.",
  redaction:
    "Phase de rédaction assistée. L'IA vous aide à développer chaque section avec rigueur académique.",
};

function StepTabButton({
  step,
  idx,
  isCurrent,
  isValidated,
  isLocked,
  onClick,
}: {
  step: ResearchStep;
  idx: number;
  isCurrent: boolean;
  isValidated: boolean;
  isLocked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLocked}
      data-ocid={`research.step_tab.${idx + 1}`}
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg text-xs font-medium transition-smooth flex-1 min-w-0 disabled:cursor-not-allowed",
        isValidated && "text-primary bg-primary/5",
        isCurrent && !isValidated && "text-foreground bg-accent/10",
        isLocked && "text-muted-foreground/40",
        !isValidated &&
          !isCurrent &&
          !isLocked &&
          "text-muted-foreground hover:bg-muted/50",
      )}
    >
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center",
          isValidated && "bg-primary text-primary-foreground",
          isCurrent &&
            !isValidated &&
            "bg-accent text-accent-foreground ring-2 ring-accent/30",
          isLocked && "bg-muted text-muted-foreground/30",
          !isValidated &&
            !isCurrent &&
            !isLocked &&
            "bg-secondary text-secondary-foreground",
        )}
      >
        {isValidated ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : isLocked ? (
          <Lock className="w-3 h-3" />
        ) : (
          idx + 1
        )}
      </div>
      <span className="truncate w-full text-center leading-tight">
        {RESEARCH_STEP_LABELS[step]}
      </span>
    </button>
  );
}

export default function ResearchStepPanel({
  project,
}: {
  project: ResearchProject;
}) {
  const [viewingStep, setViewingStep] = useState<ResearchStep>(
    project.currentStep,
  );
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendMessage = useSendResearchMessage();
  const validateStep = useValidateResearchStep();

  const currentStepIdx = RESEARCH_STEP_ORDER.indexOf(
    project.currentStep as (typeof RESEARCH_STEP_ORDER)[number],
  );
  const viewingStepIdx = RESEARCH_STEP_ORDER.indexOf(
    viewingStep as (typeof RESEARCH_STEP_ORDER)[number],
  );

  const validatedSteps = new Set(
    project.steps.filter(([, sd]) => sd.validated).map(([s]) => s),
  );
  const stepDataMap = new Map(
    project.steps.map(([step, data]) => [step, data]),
  );

  const viewingStepData: ResearchStepData = stepDataMap.get(viewingStep) ?? {
    step: viewingStep,
    content: "",
    aiResponse: "",
    validated: false,
    validatedAt: null,
    resources: [],
  };

  const isViewingCurrent = viewingStep === project.currentStep;
  const isViewingValidated = validatedSteps.has(viewingStep);
  const isViewingLocked =
    viewingStepIdx > currentStepIdx && !isViewingValidated;
  const hasAiResponse = !!viewingStepData.aiResponse;
  const canValidate = isViewingCurrent && hasAiResponse && !isViewingValidated;

  const handleSend = () => {
    if (!userInput.trim() || sendMessage.isPending) return;
    setIsSending(true);
    sendMessage.mutate(
      {
        projectId: String(project.id),
        step: viewingStep,
        userInput: userInput.trim(),
      },
      {
        onSuccess: () => {
          setUserInput("");
          setIsSending(false);
          toast.success("Réponse reçue de votre Directeur de Recherche IA");
        },
        onError: () => {
          setIsSending(false);
          toast.error("Erreur lors de l'envoi du message");
        },
      },
    );
  };

  const handleValidate = () => {
    validateStep.mutate(
      { projectId: String(project.id), step: viewingStep },
      {
        onSuccess: (result) => {
          setViewingStep(result.currentStep);
          toast.success(
            `Étape « ${RESEARCH_STEP_LABELS[viewingStep]} » validée !`,
          );
        },
        onError: () => toast.error("Erreur lors de la validation"),
      },
    );
  };

  return (
    <div className="bg-card rounded-xl border shadow-card overflow-hidden">
      {/* Step tabs */}
      <div className="border-b bg-muted/30 p-3">
        <div className="flex items-center gap-1">
          {RESEARCH_STEP_ORDER.map((step, idx) => (
            <StepTabButton
              key={step}
              step={step}
              idx={idx}
              isCurrent={step === project.currentStep}
              isValidated={validatedSteps.has(step)}
              isLocked={idx > currentStepIdx && !validatedSteps.has(step)}
              onClick={() => {
                if (idx <= currentStepIdx || validatedSteps.has(step)) {
                  setViewingStep(step);
                  setUserInput("");
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="p-5">
        {isViewingLocked ? (
          <div
            data-ocid="research.step.locked_state"
            className="py-12 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-muted mx-auto flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">
              Étape verrouillée
            </h3>
            <p className="text-sm text-muted-foreground">
              Validez les étapes précédentes pour débloquer cette section.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Step header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs font-mono">
                  Étape {viewingStepIdx + 1} / 6
                </Badge>
                {isViewingValidated && (
                  <Badge className="bg-primary/10 text-primary text-xs border-0 gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Validée
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-display font-bold text-foreground">
                Étape {viewingStepIdx + 1} : {RESEARCH_STEP_LABELS[viewingStep]}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {STEP_DESCRIPTIONS[viewingStep]}
              </p>
            </div>

            {/* AI response — academic card */}
            {hasAiResponse && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                data-ocid="research.step.ai_response"
                className="rounded-xl border-2 border-primary/20 bg-primary/3 p-5"
              >
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-primary/15">
                  <div className="w-10 h-10 rounded-full gradient-ministry flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Prof. IA — Directeur de Recherche
                    </p>
                    <p className="text-xs text-muted-foreground">
                      EDUCERT · Académie Scientifique Officielle
                    </p>
                  </div>
                  <Badge className="ml-auto bg-primary/10 text-primary border-0 text-xs">
                    Académique
                  </Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {viewingStepData.aiResponse}
                </p>
              </motion.div>
            )}

            {/* Loading AI response */}
            {isSending && (
              <div
                data-ocid="research.step.loading_state"
                className="rounded-xl border bg-muted/30 p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Analyse en cours…
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Votre Directeur de Recherche IA examine votre contribution
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            )}

            {/* Input area — current, not validated */}
            {isViewingCurrent && !isViewingValidated && (
              <div className="space-y-3">
                <Textarea
                  data-ocid="research.step.input"
                  placeholder={STEP_PLACEHOLDERS[viewingStep]}
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  rows={4}
                  disabled={sendMessage.isPending}
                  className="resize-none"
                />
                <div className="flex items-center justify-between gap-3">
                  <Button
                    type="button"
                    onClick={handleSend}
                    disabled={!userInput.trim() || sendMessage.isPending}
                    data-ocid="research.step.send_button"
                    className="gap-2"
                  >
                    {sendMessage.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyse en cours…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Soumettre à l'IA Directeur
                      </>
                    )}
                  </Button>

                  {canValidate && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleValidate}
                      disabled={validateStep.isPending}
                      data-ocid="research.step.validate_button"
                      className="gap-2 border-primary text-primary hover:bg-primary/5"
                    >
                      {validateStep.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      Valider cette étape
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Read-only for validated steps */}
            {isViewingValidated && viewingStepData.content && (
              <div className="rounded-xl border bg-background p-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Votre réponse validée
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {viewingStepData.content}
                </p>
              </div>
            )}

            {/* Resource citations */}
            {(viewingStepData.resources.length > 0 ||
              project.resourceCitations.length > 0) && (
              <div
                data-ocid="research.step.resources_panel"
                className="rounded-xl border bg-accent/5 border-accent/20 p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <BookMarked className="w-4 h-4 text-accent-foreground" />
                  <p className="text-sm font-semibold text-foreground">
                    Sources citées par l'IA
                  </p>
                </div>
                <div className="space-y-1">
                  {[
                    ...new Set([
                      ...viewingStepData.resources,
                      ...project.resourceCitations,
                    ]),
                  ].map((citation) => (
                    <div
                      key={citation}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <div className="w-1 h-1 rounded-full bg-accent-foreground/40 shrink-0 mt-1.5" />
                      {citation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
