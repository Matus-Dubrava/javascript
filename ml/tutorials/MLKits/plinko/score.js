const outputs = [];

// 1-D distance function
// function distance(pointA, pointB) {
//     return Math.abs(pointA - pointB);
// }

// multidimensional distance function
function distance(pointA, pointB) {
    // compute distance using pythagorean algorithm

    return (
        _.chain(pointA)
            .zip(pointB)
            .map(([a, b]) => (a - b) ** 2)
            .sum()
            .value() ** 0.5
    );
}

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function splitDataset(data, testCount) {
    const shuffled = _.shuffle(data);

    const testSet = _.slice(shuffled, 0, testCount);
    const trainingSet = _.slice(shuffled, testCount);

    return [testSet, trainingSet];
}

function knn(data, point, k) {
    return _.chain(data)
        .map(row => [distance(row[0], point), row[3]])
        .sortBy(row => row[0])
        .slice(0, k)
        .countBy(row => row[1])
        .toPairs()
        .sortBy(row => row[1])
        .last()
        .first()
        .parseInt()
        .value();
}

function runAnalysis() {
    const testSetSize = 100;
    const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

    _.range(1, 20).forEach(k => {
        const accuracy = _.chain(testSet)
            .filter(
                testPoint => testPoint[3] === knn(trainingSet, testPoint[0], k)
            )
            .size()
            .divide(testSetSize)
            .value();

        console.log('For k of:', k, 'Accuracy:', accuracy);
    });
}
