const calculateReadingTime = (htmlOrText = '') => {
  const text = htmlOrText.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
};

module.exports = calculateReadingTime;
