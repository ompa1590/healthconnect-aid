import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, MessageSquare, FileText, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'report' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationsPopoverProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const NotificationsPopover = ({
  notifications,
  onMarkAsRead,
  onClearAll
}: NotificationsPopoverProps) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'message':
        return MessageSquare;
      case 'report':
        return FileText;
      case 'reminder':
        return Clock;
      default:
        return Bell;
    }
  };

  const getTypeStyles = (type: Notification['type']) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-100 text-blue-600';
      case 'message':
        return 'bg-green-100 text-green-600';
      case 'report':
        return 'bg-purple-100 text-purple-600';
      case 'reminder':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          {notifications.some(n => !n.read) && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-90 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {notifications.some(n => !n.read) && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 text-muted-foreground/30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-4 p-4 hover:bg-muted/50 transition-colors",
                      !notification.read && "bg-muted/30"
                    )}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className={cn("p-2 h-[100%] rounded-full", getTypeStyles(notification.type))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <time className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.timestamp}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      {notification.action && (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm text-primary"
                          asChild
                        >
                          <a href={notification.action.href}>
                            {notification.action.label}
                          </a>
                        </Button>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
