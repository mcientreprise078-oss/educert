import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  useClearMyNotifications,
  useGetMyNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from "@/lib/queries";
import type { AppNotification, NotificationType } from "@/lib/types";
import {
  AlertCircle,
  Award,
  Bell,
  BookOpen,
  CheckCheck,
  ClipboardList,
  FileText,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function formatRelativeTime(createdAt: bigint): string {
  const diffMs = Date.now() - Number(createdAt);
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `il y a ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `il y a ${diffD}j`;
}

function notifIcon(type: NotificationType) {
  const cls = "size-4 shrink-0";
  switch (type) {
    case "inactivity_reminder":
      return <AlertCircle className={`${cls} text-amber-500`} />;
    case "course_update":
      return <BookOpen className={`${cls} text-primary`} />;
    case "quiz_ready":
      return <ClipboardList className={`${cls} text-accent`} />;
    case "certificate_issued":
      return <Award className={`${cls} text-green-500`} />;
    case "research_feedback":
      return <FileText className={`${cls} text-purple-500`} />;
    default:
      return <Bell className={`${cls} text-muted-foreground`} />;
  }
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications = [] } = useGetMyNotifications(false);
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const clearAll = useClearMyNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const prevUnreadRef = useRef(0);

  // Show toast on new notifications
  useEffect(() => {
    if (unreadCount > prevUnreadRef.current && prevUnreadRef.current > 0) {
      const newNotifs = notifications
        .filter((n) => !n.isRead)
        .slice(0, unreadCount - prevUnreadRef.current);
      for (const n of newNotifs) {
        toast(n.title, {
          description: n.message,
          duration: 5000,
        });
      }
    }
    prevUnreadRef.current = unreadCount;
  }, [unreadCount, notifications]);

  function handleNotifClick(notif: AppNotification) {
    if (!notif.isRead) {
      markRead.mutate(String(notif.id));
    }
  }

  function handleMarkAll() {
    markAll.mutate();
  }

  function handleClearAll() {
    clearAll.mutate();
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-9"
          aria-label="Notifications"
          data-ocid="navbar.notifications_button"
        >
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-0.5 -right-0.5 size-4 flex items-center justify-center p-0 text-[10px] font-bold bg-destructive text-destructive-foreground border-0 min-w-0"
              data-ocid="navbar.notifications_badge"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-80 p-0"
        data-ocid="navbar.notifications_popover"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {unreadCount} non lu{unreadCount > 1 ? "es" : "e"}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAll}
              disabled={markAll.isPending}
              data-ocid="navbar.notifications_mark_all_button"
            >
              <CheckCheck className="size-3 mr-1" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Notification list */}
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="navbar.notifications_empty_state"
            >
              <Bell className="size-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucune notification
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                Vous êtes à jour !
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notif, i) => (
                <button
                  key={String(notif.id)}
                  type="button"
                  className={`w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors duration-150 flex gap-3 items-start ${
                    notif.isRead ? "opacity-70" : ""
                  }`}
                  onClick={() => handleNotifClick(notif)}
                  data-ocid={`navbar.notification_item.${i + 1}`}
                >
                  <div className="mt-0.5">
                    {notifIcon(notif.notificationType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm truncate">
                        {notif.title}
                      </span>
                      {!notif.isRead && (
                        <span className="size-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="px-4 py-2.5 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleClearAll}
                disabled={clearAll.isPending}
                data-ocid="navbar.notifications_clear_button"
              >
                <Trash2 className="size-3 mr-1" />
                Effacer tout
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationBell;
