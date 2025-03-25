import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, MessageSquare, FileText, Clock, User, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProviderNotification {
  id: string;
  type: 'appointment' | 'message' | 'patient' | 'report' | 'urgent';
  title: string;
  description: string;
  time: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ProviderNotificationsPopoverProps {
  notifications: ProviderNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

const ProviderNotificationsPopover = ({
  notifications,
  onMarkAsRead,
  onClearAll
}: ProviderNotificationsPopoverProps) => {
  const getIcon = (type: ProviderNotification['type']) => {
    switch (type) {
      case 'appointment':
        return Calendar;
      case 'message':
        return MessageSquare;
      case 'patient':
        return User;
      case 'report':
        return FileText;
      case 'urgent':
        return Stethoscope;
      default:
        return Bell;
    }
  };

  const getTypeStyles = (type: ProviderNotification['type']) => {
    switch (type) {
      case 'appointment':
        return 'bg-blue-50 text-blue-600';
      case 'message':
        return 'bg-green-50 text-green-600';
      case 'patient':
        return 'bg-purple-50 text-purple-600';
      case 'report':
        return 'bg-amber-50 text-amber-600';
      case 'urgent':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-xs h-8">
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 text-muted-foreground/30" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex gap-3 p-3 hover:bg-muted/50 transition-colors cursor-pointer",
                      !notification.read && "bg-muted/30"
                    )}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className={cn(
                      "flex-shrink-0 rounded-full p-2",
                      getTypeStyles(notification.type)
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <time className="text-xs text-muted-foreground whitespace-nowrap">
                          {notification.time}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      {notification.action && (
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-primary font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            notification.action?.onClick();
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 pt-1">
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

export default ProviderNotificationsPopover;
