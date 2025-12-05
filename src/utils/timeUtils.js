// frontend/src/utils/timeUtils.js
export function calculateGeneratorDiff(startHour, startMinute, endHour, endMinute) {
  // empty / null / undefined handle
  if (
    startHour === "" ||
    startMinute === "" ||
    endHour === "" ||
    endMinute === "" ||
    startHour == null ||
    startMinute == null ||
    endHour == null ||
    endMinute == null
  ) {
    return null;
  }

  const sh = Number(startHour);
  const sm = Number(startMinute);
  const eh = Number(endHour);
  const em = Number(endMinute);

  // agar koi NaN aaya to calculation mat karo
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) {
    return null;
  }

  const start = sh * 60 + sm;
  const end = eh * 60 + em;
  const diff = end - start;

  if (diff <= 0) return null;

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return {
    hours,
    minutes,
    totalMinutes: diff,
    display: `${hours} H : ${minutes} M (${diff} Min)`,
  };
}
