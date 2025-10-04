export const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(acc, flattenObject(obj[key], newKey));
    } else {
      acc[newKey] = obj[key];
    }
    return acc;
  }, {});
};

export const unflattenObject = (obj) => {
  const result = {};

  for (const key in obj) {
    const keys = key.split(".");
    keys.reduce((acc, currentKey, index) => {
      if (index === keys.length - 1) {
        acc[currentKey] = obj[key];
      } else {
        acc[currentKey] = acc[currentKey] || {};
      }
      return acc[currentKey];
    }, result);
  }

  return result;
};
