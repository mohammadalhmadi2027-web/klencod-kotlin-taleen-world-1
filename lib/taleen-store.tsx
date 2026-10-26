import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getLesson, type Lesson, seedLessons } from "./taleen-content";
import { calculateLessonReward } from "./taleen-rules";

type LessonRecord = {
  completed: boolean;
  score?: number;
  completedAt: string;
};

type TaleenState = {
  childName: string;
  childAge: number;
  avatar: string;
  xp: number;
  stars: number;
  coins: number;
  streak: number;
  dailyGoal: number;
  lessonRecords: Record<string, LessonRecord>;
  favorites: string[];
  screenTimeMinutes: number;
  aiEnabled: boolean;
  notificationsEnabled: boolean;
  textScale: "مريح" | "كبير";
  customLessons: Lesson[];
  lettersCompleted: string[];
};

type TaleenContextValue = {
  state: TaleenState;
  isReady: boolean;
  completedCount: number;
  completeLesson: (lessonId: string, score?: number) => void;
  toggleFavorite: (lessonId: string) => void;
  updateParentControls: (changes: Partial<Pick<TaleenState, "screenTimeMinutes" | "aiEnabled" | "notificationsEnabled" | "dailyGoal" | "textScale">>) => void;
  addCustomLesson: (lesson: Lesson) => void;
  completeLetter: (letterId: string) => void;
  resetDemo: () => void;
};

const STORE_KEY = "taleen-world.local.v1";

const initialState: TaleenState = {
  childName: "ليان",
  childAge: 9,
  avatar: "🌟",
  xp: 340,
  stars: 18,
  coins: 42,
  streak: 4,
  dailyGoal: 2,
  lessonRecords: {
    "arabic-ba": { completed: true, score: 1, completedAt: "2026-08-20" },
    "math-addition": { completed: true, score: 1, completedAt: "2026-08-21" },
  },
  favorites: ["story-palm", "ai-basics"],
  screenTimeMinutes: 45,
  aiEnabled: false,
  notificationsEnabled: true,
  textScale: "مريح",
  customLessons: [],
  lettersCompleted: [],
};

const TaleenContext = createContext<TaleenContextValue | undefined>(undefined);

export function TaleenProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<TaleenState>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORE_KEY)
      .then((stored) => {
        if (!stored || !active) return;
        const parsed = JSON.parse(stored) as Partial<TaleenState>;
        setState((current) => ({ ...current, ...parsed, lessonRecords: parsed.lessonRecords ?? current.lessonRecords, customLessons: parsed.customLessons ?? current.customLessons, lettersCompleted: parsed.lettersCompleted ?? current.lettersCompleted }));
      })
      .catch(() => undefined)
      .finally(() => active && setIsReady(true));
    return () => { active = false; };
  }, []);

  const commit = useCallback((updater: (current: TaleenState) => TaleenState) => {
    setState((current) => {
      const next = updater(current);
      void AsyncStorage.setItem(STORE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, score = 0) => {
    commit((current) => {
      const selectedLesson = current.customLessons.find((item) => item.id === lessonId) ?? getLesson(lessonId);
      const wasCompleted = current.lessonRecords[lessonId]?.completed;
      const reward = calculateLessonReward(selectedLesson.xp, Boolean(wasCompleted));
      return {
        ...current,
        xp: current.xp + reward.xp,
        stars: current.stars + reward.stars,
        coins: current.coins + reward.coins,
        lessonRecords: {
          ...current.lessonRecords,
          [lessonId]: { completed: true, score, completedAt: new Date().toISOString() },
        },
      };
    });
  }, [commit]);

  const toggleFavorite = useCallback((lessonId: string) => {
    commit((current) => ({
      ...current,
      favorites: current.favorites.includes(lessonId)
        ? current.favorites.filter((id) => id !== lessonId)
        : [...current.favorites, lessonId],
    }));
  }, [commit]);

  const updateParentControls = useCallback((changes: Partial<Pick<TaleenState, "screenTimeMinutes" | "aiEnabled" | "notificationsEnabled" | "dailyGoal" | "textScale">>) => {
    commit((current) => ({ ...current, ...changes }));
  }, [commit]);

  const addCustomLesson = useCallback((lesson: Lesson) => {
    commit((current) => ({ ...current, customLessons: [lesson, ...current.customLessons] }));
  }, [commit]);

  const completeLetter = useCallback((letterId: string) => {
    commit((current) => current.lettersCompleted.includes(letterId) ? current : { ...current, lettersCompleted: [...current.lettersCompleted, letterId], stars: current.stars + 1, xp: current.xp + 10 });
  }, [commit]);

  const resetDemo = useCallback(() => {
    setState(initialState);
    void AsyncStorage.setItem(STORE_KEY, JSON.stringify(initialState));
  }, []);

  const value = useMemo(() => ({
    state,
    isReady,
    completedCount: Object.values(state.lessonRecords).filter((item) => item.completed).length,
    completeLesson,
    toggleFavorite,
    updateParentControls,
    addCustomLesson,
    completeLetter,
    resetDemo,
  }), [addCustomLesson, completeLetter, completeLesson, isReady, resetDemo, state, toggleFavorite, updateParentControls]);

  return <TaleenContext.Provider value={value}>{children}</TaleenContext.Provider>;
}

export function useTaleen() {
  const context = useContext(TaleenContext);
  if (!context) throw new Error("useTaleen must be used inside TaleenProvider");
  return context;
}

export function getSuggestedLesson(completedIds: string[]) {
  return seedLessons.find((item) => !completedIds.includes(item.id)) ?? seedLessons[0];
}
