export function secondsToString(seconds) {
	let numyears = Math.floor(seconds / 31536000);
	if (numyears) return numyears + ' years ';
	let numdays = Math.floor((seconds % 31536000) / 86400);
	if (numdays) return numdays + ' days ';
	let numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	if (numhours) return numhours + ' hours ';
	let numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	if (numminutes) return numminutes + ' minutes ';
	let numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
	if (numseconds) return numseconds + ' seconds';
	return "less than a second";
}
