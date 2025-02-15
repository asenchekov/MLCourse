const outputs = [];
const testOutputs = [];


function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  // Write code here to analyze stuff
  const testSetSize = 100;
  const k = 10;
  const features = [
    "dropPosition", "bounciness", "size"
  ];

  _.range(0, 3).forEach(feature => {
    const data = _.map(outputs, row => [row[feature], _.last(row)]);

    const [ testSet, trainingSet ] = splitDataset(minMax(data, 1), testSetSize);

    const accuracy = _.chain(testSet)
    .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint))
    .size()
    .divide(testSetSize)
    .value();

    console.log("Accuracy ", accuracy, "with feature = ", features[feature]);
  })
}

const knn = (data, point, k) => (
  _.chain(data)
    .map(row => [distance(_.initial(row), point), _.last(row)])
    .sortBy(row => row[0])
    .slice(0,k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value()
);

const distance = (pointsA, pointsB) => _.chain(pointsA)
    .zip(pointsB)
    .map(([a, b]) => (a-b) ** 2)
    .sum()
    .value() ** 0.5;

const splitDataset = (data, testCount) => {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
};

const minMax = (data, featureCount) => {
  const clonedData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = clonedData.map(row => row[i]);

    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < clonedData.length; j++) {
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);

      return clonedData;
    }
  }
};
