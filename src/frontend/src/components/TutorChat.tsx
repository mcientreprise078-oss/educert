import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  useAskTutor,
  useClearTutorHistory,
  useGetTutorHistory,
} from "@/lib/queries";
import type { TutorMessage } from "@/lib/types";
import { AlertCircle, BookOpen, Send, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TutorChatProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  lessonContentExcerpt: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <BookOpen className="size-3.5 text-primary" />
      </div>
      <div className="bg-muted/50 border border-border rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          {([0, 1, 2] as const).map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: TutorMessage }) {
  const isUser = msg.role === "user";
  return (
    <div
      className={`flex items-end gap-2 mb-3 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {!isUser && (
        <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <BookOpen className="size-3.5 text-primary" />
        </div>
      )}
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted/50 border border-border text-foreground rounded-bl-sm"
        }`}
      >
        {msg.content}
      </div>
    </div>
  );
}

export function TutorChat({
  courseId,
  lessonId,
  lessonTitle,
  lessonContentExcerpt,
}: TutorChatProps) {
  const [question, setQuestion] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: history = [], isLoading } = useGetTutorHistory(courseId);
  const askTutor = useAskTutor();
  const clearHistory = useClearTutorHistory();

  // scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  async function handleSend() {
    const q = question.trim();
    if (!q || askTutor.isPending) return;
    setQuestion("");
    try {
      await askTutor.mutateAsync({
        courseId,
        lessonId,
        question: q,
        lessonContext: lessonContentExcerpt,
      });
    } catch {
      toast.error("Erreur de connexion au tuteur. Réessayez.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleClear() {
    try {
      await clearHistory.mutateAsync(courseId);
    } catch {
      toast.error("Impossible d'effacer la conversation.");
    }
  }

  const isEmpty = !isLoading && history.length === 0;

  return (
    <div className="flex flex-col h-full bg-card" data-ocid="tutor_chat.panel">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center gap-2 shrink-0">
        <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center">
          <BookOpen className="size-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight">
            Tuteur IA
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {lessonTitle}
          </p>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            disabled={clearHistory.isPending}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Effacer la conversation"
            data-ocid="tutor_chat.clear_button"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollAreaRef} className="flex-1 overflow-y-auto">
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <div className="size-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                Chargement…
              </div>
            </div>
          ) : isEmpty ? (
            <div
              className="flex flex-col items-center text-center py-8 px-4"
              data-ocid="tutor_chat.empty_state"
            >
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <BookOpen className="size-6 text-primary" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Votre tuteur IA est prêt
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Posez vos questions à votre tuteur IA — il répondra comme un
                professeur d&apos;université
              </p>
            </div>
          ) : (
            history.map((msg) => (
              <MessageBubble key={msg.id.toString()} msg={msg} />
            ))
          )}
          {askTutor.isPending && <TypingIndicator />}
          {askTutor.isError && (
            <div
              className="flex items-center gap-2 text-destructive text-xs py-2 px-3 bg-destructive/5 rounded-lg mb-2"
              data-ocid="tutor_chat.error_state"
            >
              <AlertCircle className="size-3.5 shrink-0" />
              Erreur de connexion au tuteur. Réessayez.
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border bg-background shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Posez votre question…"
            className="resize-none text-sm min-h-[44px] max-h-[120px] bg-input"
            rows={1}
            disabled={askTutor.isPending}
            data-ocid="tutor_chat.input"
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!question.trim() || askTutor.isPending}
            className="shrink-0 size-[44px]"
            data-ocid="tutor_chat.send_button"
          >
            <Send className="size-4" />
          </Button>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="mt-2 text-[11px] text-muted-foreground hover:text-destructive transition-colors w-full text-center"
            data-ocid="tutor_chat.clear_link"
          >
            Effacer la conversation
          </button>
        )}
      </div>
    </div>
  );
}
