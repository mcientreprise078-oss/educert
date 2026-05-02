import { ProgressBar } from "@/components/ProgressBar";
import { TutorChat } from "@/components/TutorChat";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useGenerateChapterQuiz,
  useGetCourse,
  useGetCourseLessons,
  useGetEnrollment,
  useMarkLessonComplete,
} from "@/lib/queries";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  ListChecks,
  Loader2,
  MessageSquare,
  PlayCircle,
  RotateCcw,
  Trophy,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

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

        // Hybrid multimedia: [IMAGE: url]
        const imgMatch = line.match(/^\[IMAGE:\s*(.+?)\]$/);
        if (imgMatch) {
          return (
            <img
              key={key}
              src={imgMatch[1]}
              alt="Illustration du cours"
              className="rounded-lg max-w-full my-3 border border-border"
            />
          );
        }

        // Hybrid multimedia: [VIDEO: youtube_id]
        const vidMatch = line.match(/^\[VIDEO:\s*([\w-]+)\]$/);
        if (vidMatch) {
          return (
            <div
              key={key}
              className="relative w-full aspect-video rounded-xl overflow-hidden border border-border my-4"
            >
              <iframe
                src={`https://www.youtube.com/embed/${vidMatch[1]}`}
                title="Vidéo du cours"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          );
        }

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

// AI-generated quiz types
interface AIQuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
interface AIQuiz {
  questions: AIQuizQuestion[];
  passingScore: number;
}

interface AIQuizSectionProps {
  courseId: string;
  lessonId: string;
  lessonContent: string;
  onComplete: () => void;
}

function AIQuizSection({
  courseId,
  lessonId,
  lessonContent,
  onComplete,
}: AIQuizSectionProps) {
  const generateQuiz = useGenerateChapterQuiz();
  const [quiz, setQuiz] = useState<AIQuiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [showExplanations, setShowExplanations] = useState(false);

  const _lessonKey = lessonId.toString();

  useEffect(() => {
    setQuiz(null);
    setAnswers([]);
    setScore(null);
    setShowExplanations(false);
    generateQuiz
      .mutateAsync({ courseId, lessonId, lessonContent })
      .then((result) => {
        try {
          setQuiz(JSON.parse(result) as AIQuiz);
        } catch {
          /* ignore parse error */
        }
      })
      .catch(() => {
        /* ignore */
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, courseId, lessonContent, generateQuiz.mutateAsync]);

  if (generateQuiz.isPending || (!quiz && !generateQuiz.isError)) {
    return (
      <div
        className="mt-8 border border-border rounded-xl p-6 flex flex-col items-center gap-3"
        data-ocid="learn.ai_quiz.loading_state"
      >
        <Loader2 className="size-6 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">
          Génération du quiz par l&apos;IA…
        </p>
      </div>
    );
  }

  if (generateQuiz.isError || !quiz) {
    return (
      <div
        className="mt-8 border border-destructive/30 rounded-xl p-5 bg-destructive/5"
        data-ocid="learn.ai_quiz.error_state"
      >
        <p className="text-sm text-destructive">
          Impossible de générer le quiz pour ce chapitre.
        </p>
      </div>
    );
  }

  const passed = score !== null && score >= quiz.passingScore;
  const allAnswered =
    answers.length === quiz.questions.length &&
    answers.every((a) => a !== undefined && a !== null);

  function handleSubmit() {
    if (!quiz) return;
    const correct = quiz.questions.reduce(
      (cnt, q, i) => (answers[i] === q.correctIndex ? cnt + 1 : cnt),
      0,
    );
    const s = Math.round((correct / Math.max(1, quiz.questions.length)) * 100);
    setScore(s);
    setShowExplanations(true);
    if (s >= quiz.passingScore) onComplete();
  }

  function handleRetake() {
    setScore(null);
    setAnswers([]);
    setShowExplanations(false);
  }

  return (
    <div
      className="mt-8 border border-border rounded-xl overflow-hidden"
      data-ocid="learn.ai_quiz.section"
    >
      <div className="bg-muted/40 px-5 py-4 flex items-center gap-3 border-b border-border">
        <ListChecks className="size-5 text-primary shrink-0" />
        <div>
          <h3 className="font-display font-semibold text-foreground">
            Quiz du Chapitre
          </h3>
          <p className="text-xs text-muted-foreground">
            {quiz.questions.length} questions · Score minimum :{" "}
            {quiz.passingScore}%
          </p>
        </div>
        {score !== null && (
          <Badge
            className="ml-auto"
            variant={passed ? "default" : "destructive"}
          >
            {passed ? `Réussi · ${score}%` : `Échoué · ${score}%`}
          </Badge>
        )}
      </div>

      <div className="p-5 space-y-6">
        {quiz.questions.map((q, qi) => (
          <div key={q.id} data-ocid={`learn.ai_quiz.question.${qi + 1}`}>
            <p className="font-medium text-foreground mb-3">
              <span className="text-muted-foreground text-sm mr-2">
                {qi + 1}.
              </span>
              {q.text}
            </p>
            {showExplanations ? (
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
                {q.explanation && (
                  <p className="text-xs text-muted-foreground bg-muted/30 border border-border rounded-lg px-3 py-2 mt-1">
                    💡 {q.explanation}
                  </p>
                )}
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
                    data-ocid={`learn.ai_quiz.option.${qi + 1}.${oi + 1}`}
                  >
                    <RadioGroupItem
                      value={oi.toString()}
                      id={`aiq${qi}-o${oi}`}
                    />
                    <label
                      htmlFor={`aiq${qi}-o${oi}`}
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

        {score !== null ? (
          <div className="space-y-3 pt-2">
            <div
              className={`flex items-center gap-2 font-semibold ${
                passed ? "text-primary" : "text-destructive"
              }`}
            >
              {passed ? (
                <>
                  <Trophy className="size-5" /> Félicitations ! Leçon validée.
                </>
              ) : (
                <>
                  <XCircle className="size-5" /> Score insuffisant — réessayez.
                </>
              )}
            </div>
            {!passed && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .getElementById("lesson-content-top")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  data-ocid="learn.ai_quiz.reread_button"
                >
                  <BookOpen className="size-3.5 mr-1.5" />
                  Relire le chapitre
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetake}
                  data-ocid="learn.ai_quiz.retake_button"
                >
                  <RotateCcw className="size-3.5 mr-1.5" />
                  Réessayer
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="w-full"
            data-ocid="learn.ai_quiz.submit_button"
          >
            Soumettre les réponses
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
  const [tutorOpen, setTutorOpen] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Reset quiz pass state when lesson changes
  useEffect(() => {
    setQuizPassed(false);
  }, []);

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
    setQuizPassed(true);
    if (!currentLesson || isCurrentComplete) return;
    markComplete.mutate({
      courseId,
      lessonId: currentLesson.id,
      totalLessons: lessons.length,
    });
  }

  // String IDs for hooks
  const courseIdStr = courseId ?? "0";
  const lessonIdStr = currentLesson?.id ?? lessonId ?? "l1";
  const lessonContentExcerpt = (currentLesson?.content ?? "").slice(0, 500);

  return (
    <div
      className="min-h-screen bg-background flex flex-col"
      data-ocid="learn.page"
    >
      {/* Mobile Tutor Drawer */}
      {tutorOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col lg:hidden"
          data-ocid="tutor_chat.mobile_drawer"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setTutorOpen(false)}
            aria-label="Fermer le tuteur"
          />
          <div className="absolute bottom-0 left-0 right-0 h-[70vh] bg-card rounded-t-2xl border-t border-border flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
              <span className="font-semibold text-sm text-foreground">
                Tuteur IA
              </span>
              <button
                type="button"
                onClick={() => setTutorOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Fermer"
                data-ocid="tutor_chat.close_button"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <TutorChat
                courseId={courseIdStr}
                lessonId={lessonIdStr}
                lessonTitle={currentLesson?.title ?? ""}
                lessonContentExcerpt={lessonContentExcerpt}
              />
            </div>
          </div>
        </div>
      )}

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
          <Button
            type="button"
            variant={tutorOpen ? "default" : "outline"}
            size="sm"
            onClick={() => setTutorOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs"
            data-ocid="learn.tutor_toggle_button"
          >
            <MessageSquare className="size-3.5" />
            <span className="hidden sm:inline">Tuteur IA</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Lesson Sidebar */}
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
        <main className="flex-1 overflow-y-auto min-w-0">
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
              <div
                id="lesson-content-top"
                className="max-w-3xl mx-auto w-full px-6 py-8 space-y-8"
              >
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

                {/* AI Chapter Quiz — always generated; blocks mark complete until passed */}
                {currentLesson.content && (
                  <AIQuizSection
                    courseId={courseIdStr}
                    lessonId={lessonIdStr}
                    lessonContent={currentLesson.content}
                    onComplete={handleQuizComplete}
                  />
                )}

                {/* Mark complete: only show after quiz passed */}
                {!isCurrentComplete && quizPassed && (
                  <Button
                    type="button"
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
                      type="button"
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

        {/* Desktop Tutor Sidebar */}
        {tutorOpen && (
          <aside
            className="hidden lg:flex flex-col w-80 bg-card border-l border-border shrink-0"
            data-ocid="learn.tutor_sidebar"
          >
            <TutorChat
              courseId={courseIdStr}
              lessonId={lessonIdStr}
              lessonTitle={currentLesson?.title ?? ""}
              lessonContentExcerpt={lessonContentExcerpt}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
