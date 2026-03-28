"use client";
import { useState, useEffect, useRef } from "react";

interface TimerState {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isComplete: boolean;
  progress: number;
}

export function useTimer(soberTime: Date | null): TimerState {
  const [now, setNow] = useState(Date.now());
  const initialSecondsRef = useRef<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // soberTimeから残り秒数を直接計算（stateの遅延なし）
  const totalSeconds = soberTime
    ? Math.max(0, Math.floor((soberTime.getTime() - now) / 1000))
    : 0;

  // 初回のtotalSecondsを記録（プログレスバー用）
  if (soberTime && initialSecondsRef.current === null && totalSeconds > 0) {
    initialSecondsRef.current = totalSeconds;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isComplete = soberTime !== null && totalSeconds <= 0;
  const initialSeconds = initialSecondsRef.current ?? 0;
  const progress = initialSeconds > 0 ? 1 - totalSeconds / initialSeconds : 1;

  return { hours, minutes, seconds, totalSeconds, isComplete, progress };
}
