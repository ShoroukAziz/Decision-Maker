const toPercentage = (object) => {
  let totalVotes = 0;

  for (let element of object) {
    totalVotes += Number(element.sum);
  }

  for (let element of object) {
    element.sum = String(Math.round(Number(element.sum)/totalVotes * 100));
  }

  return object;
};

module.exports = { toPercentage };
