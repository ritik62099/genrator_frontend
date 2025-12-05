// frontend/src/utils/timeUtils.js

// Generator meter ke liye diff nikalo
export function calculateGeneratorDiff(startHour, startMinute, endHour, endMinute) {
  if (
    startHour === "" ||
    startMinute === "" ||
    endHour === "" ||
    endMinute === ""
  ) {
    return null;
  }

  const sh = Number(startHour);
  const sm = Number(startMinute);
  const eh = Number(endHour);
  const em = Number(endMinute);

  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return null;

  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const diff = end - start;

  if (diff <= 0) return null;

  return {
    hours: Math.floor(diff / 60),
    minutes: diff % 60,
    totalMinutes: diff,
  };
}

// Total ko number me dikhana hai (minutes)
export function formatDuration(totalMinutes) {
  return `${totalMinutes} Min`;
}
