/**
 * Filters out unwanted fields from an object
 * @param {Object} obj - The object to filter
 * @param {...string} allowedFields - Fields to keep in the object
 * @returns {Object} A new object with only the allowed fields
 */
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  
  // Iterate over the object and include only allowed fields
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  
  return newObj;
};

export default filterObj;
