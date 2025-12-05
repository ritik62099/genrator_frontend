export function calculateGeneratorDiff(startHour, startMinute, endHour, endMinute) {
  const sh = Number(startHour);
  const sm = Number(startMinute);
  const eh = Number(endHour);
  const em = Number(endMinute);

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
    display: `${hours} H : ${minutes} M (${diff} Min)`  // 🟢 Final Output
  };
}
