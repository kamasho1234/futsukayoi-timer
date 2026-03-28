export type Gender = "male" | "female";

export interface UserProfile {
  weightKg: number;
  gender: Gender;
}

export interface DrinkPreset {
  id: string;
  name: string;
  icon: string;
  image: string;
  defaultVolumeMl: number;
  alcoholPercentage: number;
  pureAlcoholG: number;
}

export interface DrinkEntry {
  presetId: string;
  name: string;
  quantity: number;
  pureAlcoholG: number;
}

export interface DrinkingSession {
  entries: DrinkEntry[];
  startedAt: string;
  profile: UserProfile;
}

export type AdviceLevel = "light" | "moderate" | "heavy" | "dangerous";

export interface MetabolismResult {
  totalAlcoholG: number;
  metabolismRateGPerHour: number;
  hoursToSober: number;
  soberTime: Date;
  adviceLevel: AdviceLevel;
}

export interface RecoveryAdvice {
  waterIntakeMl: number;
  foods: string[];
  warnings: string[];
  tips: string[];
}
