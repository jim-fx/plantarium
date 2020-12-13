export default function versionToNumber(v: string) {
  return parseInt(v.split('.').join(''), 10);
}
