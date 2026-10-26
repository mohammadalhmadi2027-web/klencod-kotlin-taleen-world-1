export function calculateLessonReward(xp: number, wasCompleted: boolean) {
  if (wasCompleted) return { xp: 0, stars: 0, coins: 0 };
  return { xp: Math.max(0, xp), stars: Math.max(1, Math.round(xp / 20)), coins: 3 };
}

export function calculateDailyProgress(completedCount: number, dailyGoal: number) {
  if (dailyGoal <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((completedCount / dailyGoal) * 100)));
}

export function isAgeAppropriate(minAge: number, maxAge: number, age: number) {
  return age >= minAge && age <= maxAge;
}
