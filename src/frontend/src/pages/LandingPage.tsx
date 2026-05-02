import { CourseCard } from "@/components/CourseCard";
import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useGetCourses } from "@/lib/queries";
import type { Difficulty } from "@/lib/types";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const STATS = [
  { icon: BookOpen, label: "Cours disponibles", value: "150+" },
  { icon: Users, label: "Apprenants actifs", value: "12 000+" },
  { icon: Award, label: "Certificats délivrés", value: "8 500+" },
  { icon: Star, label: "Note moyenne", value: "4.8/5" },
];

const FEATURES = [
  {
    title: "Formateurs experts",
    desc: "Des professionnels reconnus dans leur domaine partageant leur expertise réelle.",
  },
  {
    title: "Certificats valorisants",
    desc: "Obtenez des certifications reconnues pour booster votre carrière professionnelle.",
  },
  {
    title: "Apprentissage flexible",
    desc: "Apprenez à votre rythme, sur tous vos appareils, quand vous le souhaitez.",
  },
  {
    title: "Contenu mis à jour",
    desc: "Des formations régulièrement mises à jour pour rester à la pointe de votre secteur.",
  },
];

const TESTIMONIALS = [
  {
    name: "Camille Rousseau",
    role: "Chef de Projet Senior",
    text: "EDUCERT m'a permis d'obtenir ma certification PMP en seulement 3 mois. Les cours sont clairs, pratiques et directement applicables.",
    rating: 5,
  },
  {
    name: "Yacine Benmoussa",
    role: "Data Analyst",
    text: "La formation en science des données est exceptionnelle. J'ai décroché mon premier poste de data analyst grâce aux compétences acquises ici.",
    rating: 5,
  },
  {
    name: "Nathalie Fontaine",
    role: "DRH",
    text: "Nous utilisons EDUCERT pour toute notre équipe. Le retour sur investissement est immédiat et les collaborateurs adorent le format.",
    rating: 5,
  },
];

export default function LandingPage() {
  const { isAuthenticated, login, needsOnboarding } = useAuth();
  const navigate = useNavigate();

  const handleCTA = () => {
    if (isAuthenticated) {
      if (needsOnboarding) navigate({ to: "/onboarding" });
      else navigate({ to: "/catalog" });
    } else {
      login();
    }
  };

  const featuredCourses = useGetCourses();
  const courses = featuredCourses.data ?? [];

  return (
    <Layout fullWidth>
      {/* Hero */}
      <section className="bg-card border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container mx-auto px-4 max-w-7xl py-20 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 font-medium px-3 py-1">
              🎓 Plateforme de formation professionnelle
            </Badge>
            <h1 className="font-display font-bold text-4xl md:text-6xl leading-tight tracking-tight text-foreground mb-6">
              Développez votre <span className="text-primary">expertise</span>{" "}
              avec des formations de{" "}
              <span className="text-accent">qualité</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              Accédez à plus de 150 formations professionnelles animées par des
              experts. Apprenez à votre rythme, obtenez des certifications
              reconnues et boostez votre carrière.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                onClick={handleCTA}
                className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8 h-12 shadow-elevated"
                data-ocid="hero.primary_cta_button"
              >
                Commencer gratuitement
                <ArrowRight className="size-4 ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base px-8 h-12"
                data-ocid="hero.catalog_button"
              >
                <Link to="/catalog">Voir le catalogue</Link>
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-5 flex items-center justify-center gap-2">
              <CheckCircle className="size-4 text-primary" />
              Aucune carte de crédit requise · Accès immédiat
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="bg-background border-b border-border py-10"
        data-ocid="stats.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center text-center gap-2 animate-slide-up"
                >
                  <div className="rounded-full bg-primary/10 p-2.5">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <span className="font-display font-bold text-2xl text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured courses */}
      <section
        className="bg-muted/30 py-16"
        data-ocid="featured_courses.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-1">
                Formations en vedette
              </h2>
              <p className="text-muted-foreground">
                Sélectionnées par nos experts pour leur pertinence et qualité
              </p>
            </div>
            <Button
              variant="ghost"
              asChild
              className="hidden sm:flex"
              data-ocid="featured_courses.view_all_link"
            >
              <Link to="/catalog">
                Tout voir <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="featured_courses.list"
          >
            {courses.map((course, i) => (
              <CourseCard
                key={course.id}
                {...course}
                difficulty={course.difficulty as Difficulty}
                index={i}
              />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button
              variant="outline"
              asChild
              data-ocid="featured_courses.mobile_view_all_link"
            >
              <Link to="/catalog">
                Voir toutes les formations{" "}
                <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-background py-16"
        data-ocid="features.section"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">
              Pourquoi choisir EDUCERT ?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Une plateforme conçue pour vous donner les meilleures conditions
              d'apprentissage.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-elevated transition-smooth animate-slide-up"
              >
                <div className="w-8 h-1 rounded-full bg-primary mb-4" />
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/30 py-16" data-ocid="testimonials.section">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">
              Ce que disent nos apprenants
            </h2>
            <p className="text-muted-foreground">
              Des milliers de professionnels font confiance à EDUCERT
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="bg-card border border-border rounded-xl p-6 shadow-card animate-slide-up"
                data-ocid={`testimonials.item.${i + 1}`}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }, (_, j) => (
                    <Star
                      key={`star-${t.name}-${j}`}
                      className="size-4 fill-accent text-accent"
                    />
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {t.name}
                  </p>
                  <p className="text-muted-foreground text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-card border-t border-border py-16">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl text-foreground mb-4">
              Prêt à transformer votre carrière ?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Rejoignez des milliers de professionnels qui ont déjà fait
              confiance à EDUCERT pour développer leurs compétences.
            </p>
            <Button
              size="lg"
              onClick={handleCTA}
              className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-10 h-12 shadow-elevated"
              data-ocid="cta_banner.primary_button"
            >
              Commencer maintenant
              <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
