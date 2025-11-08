/**
 * Wraps an async function to catch any errors and pass them to the next middleware
 * @param {Function} fn - Async function to wrap
 * @returns {Function} - Wrapped middleware function
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
