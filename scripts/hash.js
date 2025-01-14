const START_DATE_STRING = "2024-01-06";
const START_INDEX = 3;

export function getTodaysHash() {
  // Normalize time so word changes at 12AM local time for user
  const startDate = new Date(START_DATE_STRING);
  startDate.setHours(0, 0, 0, 0);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffInMilliseconds = now - startDate;
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  return diffInDays + START_INDEX;
}

