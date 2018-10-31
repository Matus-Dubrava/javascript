// the actual function
// - takes inputs from range [0, 10)
function testFunction(x, y, z) {
	return x + 2 * y - z;
}

function buildDataset(size, func) {
	const dataset = [];

	for (let i = 0; i < size; i++) {
		const x = Math.floor(Math.random() * 10);
		const y = Math.floor(Math.random() * 10);
		const z = Math.floor(Math.random() * 10);
		const output = func(x, y, z);

		dataset.push([x, y, z, output]);
	}

	return dataset;
}

function getDistance(row, target) {
	let sumOfSquares = 0;
	for (let i = 0; i < target.length; i++) {
		sumOfSquares += (row[i] - target[i]) ** 2;
	}

	return sumOfSquares ** 0.5;
}

function getDistances(dataset, target) {
	return dataset.map(row => [getDistance(row, target), row[row.length - 1]]);
}

function getFrequencies(matrix) {
	return matrix.reduce((acc, v) => {
		if (acc[v[1]]) {
			acc[v[1]] += 1;
		} else {
			acc[v[1]] = 1;
		}
		return acc;
	}, {});
}

function getMostFrequent(frequencies) {
	return Object.keys(frequencies).reduce((acc, v) => {
		if (frequencies[v] > acc) {
			return v;
		} else {
			return acc;
		}
	}, -Infinity);
}

function knn(dataset, target, k) {
	const distances = getDistances(dataset, target);

	distances.sort((a, b) => {
		if (a[0] < b[0]) {
			return -1;
		}
		if (a[0] > b[0]) {
			return 1;
		}
		return 0;
	});

	const kNearest = distances.slice(0, k);
	// console.log(kNearest);

	const frequencies = getFrequencies(kNearest);
	// console.log(frequencies);

	const mostFrequent = getMostFrequent(frequencies);
	// console.log(mostFrequent);

	return parseInt(mostFrequent);
}

function testAccuracy(dataset, trainTestRatio, k) {
	const cloned = _.cloneDeep(dataset);
	const shuffled = _.shuffle(cloned);

	const splitAt = Math.floor(dataset.length * trainTestRatio);
	const trainigSet = shuffled.slice(0, splitAt);
	const testSet = shuffled.slice(splitAt).map(testRow => testRow);

	let correctCount = 0;
	testSet.forEach(testRow => {
		const predicted = knn(
			trainigSet,
			testRow.slice(0, testRow.length - 1),
			k
		);
		const actual = testRow[testRow.length - 1];
		if (predicted === actual) {
			correctCount++;
		}
	});

	console.log("Accuracy: ", correctCount / testSet.length);
}

const dataset = buildDataset(10000, testFunction);
testAccuracy(dataset, 0.7, 3);

// const target = [5, 0, 9];
// const predicted = knn(dataset, target, 3);
// const actual = realFunction(...target);

// console.log("predicted: ", predicted);
// console.log("actual: ", actual);
