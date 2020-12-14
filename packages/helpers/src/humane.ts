const getPluralS = (amount: number) => (amount > 1 ? 's' : '');

const time = (millis: number) => {
  if (typeof millis !== 'number' || isNaN(millis)) return 'never';

  if (millis < 1000) return millis + ' millisecond' + getPluralS(millis);

  const seconds = Math.floor(millis / 1000);
  if (seconds < 60) return seconds + ' second' + getPluralS(seconds);

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + ' minute' + getPluralS(minutes);

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + ' hour' + getPluralS(hours);

  const days = Math.floor(hours / 24);
  if (days < 7) return days + ' day' + getPluralS(days);

  // This is not exactly correct as
  // not every month has 30 days
  // but for this purpose its enough
  const weeks = Math.floor(days / 7);
  if (weeks < 30) return weeks + ' week' + getPluralS(weeks);

  const months = Math.floor(weeks / 30);
  if (months < 12) return months + ' month' + getPluralS(months);

  const years = Math.floor(months / 12);
  if (years < 10) return years + ' year' + getPluralS(years);

  const decades = Math.floor(months / 10);
  return decades + ' decade' + getPluralS(decades);
};

export { time };
