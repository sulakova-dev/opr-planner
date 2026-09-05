function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getNextFriday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay();

  const daysUntilFriday = (5 - dayOfWeek + 7) % 7;

  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + daysUntilFriday);

  return formatDate(nextFriday);
}
