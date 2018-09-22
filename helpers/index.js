let userCount = 0;
let skipVoteCount = 0;
let BSBmode = false;

module.exports.incrementUserCount = () => {
  userCount++;
};

module.exports.decrementUserCount = () => {
  userCount--;
};

module.exports.getUserCount = () => {
  return userCount;
};

module.exports.incrementSkipVoteCount = () => {
  skipVoteCount++;
};

module.exports.decrementSkipVoteCount = () => {
  if (skipVoteCount > 0) {
    skipVoteCount--;
  }
};

module.exports.zeroSkipVoteCount = () => {
  skipVoteCount = 0;
};

module.exports.getSkipVoteCount = () => {
  return skipVoteCount;
};

module.exports.toggleBSBmode = () => {
  BSBmode = !BSBmode;
};

module.exports.getBSBmode = () => {
  return BSBmode;
}