export const calculateAverageMastery = (topicProgress) => {
  if (!topicProgress || topicProgress.length === 0) return 0;

  const total = topicProgress.reduce((acc, topic) => acc + (topic.mastery || 0), 0);
  return Math.round(total / topicProgress.length);
};
