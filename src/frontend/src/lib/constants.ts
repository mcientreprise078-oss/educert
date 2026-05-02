import type { Difficulty } from "./types";

export const CATEGORIES = [
  "Développement Web",
  "Science des Données",
  "Gestion de Projet",
  "Leadership & Management",
  "Design & UX",
  "Marketing Digital",
  "Finance & Comptabilité",
  "Ressources Humaines",
  "Communication",
  "Intelligence Artificielle",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: "bg-primary/10 text-primary",
  intermediate: "bg-accent/10 text-accent",
  advanced: "bg-destructive/10 text-destructive",
};

export const ROLE_LABELS: Record<string, string> = {
  learner: "Apprenant",
  instructor: "Formateur",
  admin: "Administrateur",
  ministryReviewer: "Réviseur Ministériel",
  guest: "Invité",
};

export const PRICE_LABELS = {
  free: "Gratuit",
  paid: "Payant",
  all: "Tous",
} as const;

export const RESEARCH_STEP_LABELS: Record<string, string> = {
  sujet: "Choix du Sujet",
  problematique: "Problématique",
  hypotheses: "Hypothèses",
  methodologie: "Méthodologie",
  plan: "Plan de Travail",
  redaction: "Rédaction Finale",
};

export const RESEARCH_STEP_DESCRIPTIONS: Record<string, string> = {
  sujet: "Définissez votre sujet de recherche et ses objectifs principaux.",
  problematique:
    "Formulez la problématique centrale de votre travail de recherche.",
  hypotheses:
    "Posez vos hypothèses de travail et les questions de recherche associées.",
  methodologie:
    "Décrivez l'approche méthodologique et les outils de collecte de données.",
  plan: "Structurez le plan détaillé de votre travail chapitre par chapitre.",
  redaction:
    "Rédigez et finalisez votre travail en vous appuyant sur les étapes validées.",
};

export const RESEARCH_STEP_ORDER = [
  "sujet",
  "problematique",
  "hypotheses",
  "methodologie",
  "plan",
  "redaction",
] as const;

export const RESEARCH_STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  in_progress: "En cours",
  completed: "Terminé",
};
