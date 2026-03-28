"use client";
import { useEffect, useRef, useState } from "react";
import { requestNotificationPermission, sendNotification } from "@/lib/notification";

export function useHydrationReminder(enabled: boolean, intervalMinutes: number = 30) {
  const [lastReminder, setLastReminder] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    requestNotificationPermission();

    intervalRef.current = setInterval(() => {
      sendNotification("💧 水分補給の時間です", "コップ1杯の水を飲みましょう！");
      setLastReminder(new Date());
    }, intervalMinutes * 60 * 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, intervalMinutes]);

  return { lastReminder };
}
