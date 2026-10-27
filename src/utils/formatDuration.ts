export function formatDurationSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

export function formatClockLabel(dateIso: string): string {
  const parsed = new Date(dateIso);
  const hours = parsed.getHours();
  const minutes = parsed.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const normalizedHour = hours % 12 || 12;
  return `${normalizedHour}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

export function formatDateLabel(dateIso: string): string {
  return new Date(dateIso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}
