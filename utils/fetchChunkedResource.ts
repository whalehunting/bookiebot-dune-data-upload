export const getNumberArray = (min: number, max: number) => {
	const numberArray: number[] = []

	for (let i = min; i <= max; i++) {
		numberArray.push(i)
	}

	return numberArray
}

const getNumberOfChunks = (totalSize: number, chunkSize: number) => {
	return Math.ceil(totalSize / chunkSize)
}

async function fetchChunkedResource<T>(
	totalSize: number,
	chunkSize: number,
	fetchChunk: (chunkNumber: number) => Promise<T[]>,
	chunkLogger?: (chunkNumber: number, numberOfChunks: number) => void,
) {
	const numberOfChunks = getNumberOfChunks(totalSize, chunkSize)

	const chunks: T[] = []

	for (const chunkNumber of getNumberArray(1, numberOfChunks)) {
		if (chunkLogger) chunkLogger(chunkNumber, numberOfChunks)
		const chunk = await fetchChunk(chunkNumber)

		chunks.push(...chunk)
	}

	return chunks
}

export default fetchChunkedResource
