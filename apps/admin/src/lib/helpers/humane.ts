export function secondsToString(seconds) {
  const numyears = Math.floor(seconds / 31536000);
  if (numyears) return numyears + ' years ';
  const numdays = Math.floor((seconds % 31536000) / 86400);
  if (numdays) return numdays + ' days ';
  const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
  if (numhours) return numhours + ' hours ';
  const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
  if (numminutes) return numminutes + ' minutes ';
  const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
  if (numseconds) return numseconds + ' seconds';
  return 'less than a second';
}
