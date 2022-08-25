export default function insertArray(
	arr: Float32Array,
	startIndex: number,
	elems: number[] | Float32Array
) {
	for (let i = 0; i < elems.length; i++) {
		arr[startIndex + i] = elems[i];
	}
}
