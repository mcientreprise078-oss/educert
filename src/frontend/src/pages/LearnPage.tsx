import { ProgressBar } from "@/components/ProgressBar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useGetCourse,
  useGetCourseLessons,
  useGetEnrollment,
  useGetQuiz,
  useMarkLessonComplete,
  useSubmitQuiz,
} from "@/lib/queries";
import type { QuizResult } from "@/lib/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ListChecks,
  Loader2,
  PlayCircle,
  RotateCcw,
  Trophy,
  XCircle,
} from "lucide-react";
import { useState } from "react";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem > 0 ? `${h}h ${rem}min` : `${h}h`;
}

function parseBold(text: string): React.ReactNode[] {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={`b-${part}`}>{part}</strong> : part,
  );
}

function LessonContent({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-3 text-foreground">
      {lines.map((line, i) => {
        const key = `line-${i}-${line.slice(0, 20)}`;
        if (line.startsWith("## ")) {
          return (
            <h2
              key={key}
              className="font-display font-bold text-xl text-foreground mt-6 mb-2"
            >
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={key}
              className="font-display font-semibold text-base text-foreground mt-4 mb-1"
            >
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("```")) return null;
        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={key}
              className="border-l-4 border-primary/40 pl-4 italic text-muted-foreground bg-muted/30 py-2 rounded-r-lg"
            >
              {parseBold(line.slice(2))}
            </blockquote>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <li key={key} className="ml-5 text-muted-foreground list-decimal">
              {parseBold(line.replace(/^\d+\. /, ""))}
            </li>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <li key={key} className="ml-5 text-muted-foreground list-disc">
              {parseBold(line.slice(2))}
            </li>
          );
        }
        if (line.trim() === "") return <div key={key} className="h-2" />;
        return (
          <p key={key} className="text-muted-foreground leading-relaxed">
            {parseBold(line)}
          </p>
        );
      })}
    </div>
  );
}

interface QuizSectionProps {
  lessonId: string;
  courseId: string;
  isAlreadyComplete: boolean;
  onComplete: () => void;
}

function QuizSection({ lessonId, onComplete }: QuizSectionProps) {
  const { data: quiz, isLoading } = useGetQuiz(lessonId);
  const submitQuiz = useSubmitQuiz();
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  if (isLoading)
    return (
      <div className="flex justify-center py-6">
        <LoadingSpinner />
      </div>
    );
  if (!quiz) return null;

  async function handleSubmit() {
    if (!quiz) return;
    const res = await submitQuiz.mutateAsync({ lessonId, answers, quiz });
    setResult(res);
    if (res.passed) onComplete();
  }

  function handleRetake() {
    setResult(null);
    setAnswers([]);
  }

  const allAnswered =
    answers.length === quiz.questions.length &&
    answers.every((a) => a !== undefined && a !== null);

  return (
    <div
      className="mt-8 border border-border rounded-xl overflow-hidden"
      data-ocid="learn.quiz.section"
    >
      <div className="bg-muted/40 px-5 py-4 flex items-center gap-3 border-b border-border">
        <ListChecks className="size-5 text-primary shrink-0" />
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Quiz de validation
          </h3>
          <p className="text-xs text-muted-foreground">
            {quiz.questions.length} questions · Score minimum :{" "}
            {quiz.passingScore}%
          </p>
        </div>
        {result && (
          <Badge
            className="ml-auto"
            variant={result.passed ? "default" : "destructive"}
          >
            {result.passed
              ? `Réussi · ${result.score}%`
              : `Échoué · ${result.score}%`}
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-6">
        {quiz.questions.map((q, qi) => (
          <div key={q.id} data-ocid={`learn.quiz.question.${qi + 1}`}>
            <p className="font-medium text-foreground mb-3">
              <span className="text-muted-foreground text-sm mr-2">
                {qi + 1}.
              </span>
              {q.text}
            </p>
            {result ? (
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isCorrect = q.correctIndex === oi;
                  let cls =
                    "flex items-center gap-3 p-3 rounded-lg border text-sm ";
                  if (isCorrect)
                    cls += "border-primary/40 bg-primary/5 text-foreground";
                  else if (isSelected && !isCorrect)
                    cls +=
                      "border-destructive/40 bg-destructive/5 text-muted-foreground line-through";
                  else cls += "border-border text-muted-foreground";
                  return (
                    <div key={`${q.id}-opt-${oi}`} className={cls}>
                      {isCorrect ? (
                        <CheckCircle className="size-4 text-primary shrink-0" />
                      ) : isSelected ? (
                        <XCircle className="size-4 text-destructive shrink-0" />
                      ) : (
                        <div className="size-4 rounded-full border border-border shrink-0" />
                      )}
                      {opt}
                    </div>
                  );
                })}
              </div>
            ) : (
              <RadioGroup
                value={answers[qi]?.toString() ?? ""}
                onValueChange={(val) => {
                  const next = [...answers];
                  next[qi] = Number.parseInt(val);
                  setAnswers(next);
                }}
                className="space-y-2"
              >
                {q.options.map((opt, oi) => (
                  <div
                    key={`${q.id}-opt-${oi}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors cursor-pointer"
                    data-ocid={`learn.quiz.option.${qi + 1}.${oi + 1}`}
                  >
                    <RadioGroupItem
                      value={oi.toString()}
                      id={`q${qi}-o${oi}`}
                    />
                    <label
                      htmlFor={`q${qi}-o${oi}`}
                      className="text-sm text-muted-foreground cursor-pointer flex-1"
                    >
                      {opt}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        ))}

        {result ? (
          <div className="flex items-center justify-between pt-2">
            <div
              className={`flex items-center gap-2 font-semibold ${result.passed ? "text-primary" : "text-destructive"}`}
            >
              {result.passed ? (
                <>
                  <Trophy className="size-5" /> Félicitations ! Leçon validée.
                </>
              ) : (
                <>
                  <XCircle className="size-5" /> Score insuffisant — réessayez.
                </>
              )}
            </div>
            {!result.passed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetake}
                data-ocid="learn.quiz.retake_button"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                Réessayer
              </Button>
            )}
          </div>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered || submitQuiz.isPending}
            className="w-full"
            data-ocid="learn.quiz.submit_button"
          >
            {submitQuiz.isPending ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Correction en cours…
              </>
            ) : (
              "Soumettre les réponses"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function LearnPage() {
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams({
    from: "/learn/$courseId/$lessonId",
  });

  const { data: course } = useGetCourse(courseId);
  const { data: lessons = [], isLoading: lessonsLoading } =
    useGetCourseLessons(courseId);
  const { data: enrollment } = useGetEnrollment(courseId);
  const markComplete = useMarkLessonComplete();

  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const currentLesson = lessons[currentIndex] ?? lessons[0];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const completedLessons = enrollment?.completedLessons ?? [];
  const isCurrentComplete = currentLesson
    ? completedLessons.includes(currentLesson.id)
    : false;
  const progress =
    lessons.length > 0
      ? Math.round((completedLessons.length / lessons.length) * 100)
      : (enrollment?.progress ?? 0);

  const [markLoading, setMarkLoading] = useState(false);

  async function handleMarkComplete() {
    if (!currentLesson || isCurrentComplete) return;
    setMarkLoading(true);
    try {
      await markComplete.mutateAsync({
        courseId,
        lessonId: currentLesson.id,
        totalLessons: lessons.length,
      });
    } finally {
      setMarkLoading(false);
    }
  }

  function handleQuizComplete() {
    if (!currentLesson || isCurrentComplete) return;
    markComplete.mutate({
      courseId,
      lessonId: currentLesson.id,
      totalLessons: lessons.length,
    });
  }

  // Show quiz on every 3rd lesson and on l1/l2
  const hasQuiz =
    currentLesson?.id === "l1" ||
    currentLesson?.id === "l2" ||
    currentIndex % 3 === 2;

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="learn.page"
    >
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center gap-4 sticky top-0 z-40 shadow-card">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="shrink-0"
          data-ocid="learn.back_button"
        >
          <Link to="/courses/$courseId" params={{ courseId }}>
            <ArrowLeft className="size-4 mr-1.5" />
            <span className="hidden sm:inline max-w-48 truncate">
              {course?.title ?? "Formation"}
            </span>
          </Link>
        </Button>

        <Separator orientation="vertical" className="h-5 hidden sm:block" />

        <div className="flex-1 max-w-sm hidden sm:flex items-center gap-3">
          <ProgressBar
            value={progress}
            showLabel={false}
            className="flex-1 h-2"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap font-medium">
            {progress}%
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isCurrentComplete && (
            <Badge
              variant="outline"
              className="text-primary border-primary/30 bg-primary/5 text-xs hidden sm:flex items-center gap-1"
            >
              <CheckCircle className="size-3" />
              Complétée
            </Badge>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className="hidden lg:flex flex-col w-72 bg-card border-r border-border shrink-0"
          data-ocid="learn.sidebar"
        >
          <div className="p-4 border-b border-border">
            <h2 className="font-display font-semibold text-sm text-foreground mb-0.5">
              Programme du cours
            </h2>
            <p className="text-xs text-muted-foreground">
              {completedLessons.length}/{lessons.length} leçons terminées
            </p>
          </div>
          <ScrollArea className="flex-1">
            <nav className="p-3 space-y-0.5">
              {lessonsLoading
                ? (
                    ["skel-1", "skel-2", "skel-3", "skel-4", "skel-5"] as const
                  ).map((k) => (
                    <div
                      key={k}
                      className="h-10 bg-muted/30 rounded-lg animate-pulse mb-1"
                    />
                  ))
                : lessons.map((lesson, i) => {
                    const isDone = completedLessons.includes(lesson.id);
                    const isCurrent = lesson.id === currentLesson?.id;
                    return (
                      <Link
                        key={lesson.id}
                        to="/learn/$courseId/$lessonId"
                        params={{ courseId, lessonId: lesson.id }}
                        className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-smooth ${
                          isCurrent
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                        data-ocid={`learn.lesson_nav.${i + 1}`}
                      >
                        <div className="shrink-0">
                          {isDone ? (
                            <CheckCircle className="size-4 text-primary" />
                          ) : isCurrent ? (
                            <PlayCircle className="size-4 text-primary" />
                          ) : (
                            <div className="size-4 rounded-full border border-border flex items-center justify-center">
                              <span className="text-[9px] font-bold">
                                {i + 1}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="line-clamp-2 leading-tight">
                            {lesson.title}
                          </span>
                          <span className="text-[10px] opacity-60 block mt-0.5">
                            {formatDuration(lesson.duration)}
                          </span>
                        </div>
                        {isCurrent && (
                          <ChevronRight className="size-3.5 shrink-0 opacity-60" />
                        )}
                      </Link>
                    );
                  })}
            </nav>
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {lessonsLoading || !currentLesson ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {/* Video or banner */}
              {currentLesson.videoUrl ? (
                <div className="bg-black w-full aspect-video flex items-center justify-center max-h-[55vh]">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={currentLesson.videoUrl}
                    data-ocid="learn.video_player"
                  >
                    <track kind="captions" />
                  </video>
                </div>
              ) : (
                <div className="bg-muted/20 w-full border-b border-border flex flex-col items-center justify-center py-10">
                  <div className="rounded-full bg-primary/10 p-5 mb-3">
                    <BookOpen className="size-10 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Leçon textuelle
                  </p>
                </div>
              )}

              {/* Lesson body */}
              <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-8">
                {/* Meta */}
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <span>
                      Leçon {currentIndex + 1} sur {lessons.length}
                    </span>
                    {isCurrentComplete && (
                      <Badge
                        variant="outline"
                        className="text-primary border-primary/30 bg-primary/5 text-xs flex items-center gap-1"
                      >
                        <CheckCircle className="size-3" /> Complétée
                      </Badge>
                    )}
                  </div>
                  <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground">
                    {currentLesson.title}
                  </h1>
                  {currentLesson.description && (
                    <p className="text-muted-foreground mt-2">
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                {/* Content */}
                {currentLesson.content && (
                  <LessonContent content={currentLesson.content} />
                )}

                {/* Mark complete (no quiz) */}
                {!isCurrentComplete && !hasQuiz && (
                  <Button
                    onClick={handleMarkComplete}
                    disabled={markLoading}
                    className="w-full sm:w-auto"
                    data-ocid="learn.mark_complete_button"
                  >
                    {markLoading ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" />
                        Enregistrement…
                      </>
                    ) : (
                      <>
                        <CheckCircle className="size-4 mr-2" />
                        Marquer comme terminée
                      </>
                    )}
                  </Button>
                )}

                {/* Quiz */}
                {hasQuiz && (
                  <QuizSection
                    lessonId={currentLesson.id}
                    courseId={courseId}
                    isAlreadyComplete={isCurrentComplete}
                    onComplete={handleQuizComplete}
                  />
                )}

                <Separator />

                {/* Prev / Next */}
                <div
                  className="flex items-center justify-between"
                  data-ocid="learn.navigation"
                >
                  {prevLesson ? (
                    <Button
                      asChild
                      variant="outline"
                      data-ocid="learn.prev_lesson_button"
                    >
                      <Link
                        to="/learn/$courseId/$lessonId"
                        params={{ courseId, lessonId: prevLesson.id }}
                      >
                        <ArrowLeft className="size-4 mr-1.5" />
                        Précédent
                      </Link>
                    </Button>
                  ) : (
                    <div />
                  )}

                  {nextLesson ? (
                    <Button asChild data-ocid="learn.next_lesson_button">
                      <Link
                        to="/learn/$courseId/$lessonId"
                        params={{ courseId, lessonId: nextLesson.id }}
                      >
                        Suivant
                        <ArrowRight className="size-4 ml-1.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate({ to: "/certificates" })}
                      className="bg-accent text-accent-foreground hover:bg-accent/90"
                      data-ocid="learn.finish_button"
                    >
                      <Trophy className="size-4 mr-1.5" />
                      Voir mes certificats
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
