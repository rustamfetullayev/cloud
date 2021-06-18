export const serialize = (obj, prefix) => {
  let str = [];
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let keyName = prefix ? `${prefix}[${key}]` : key;
      let value = obj[key];
      str.push(
        typeof value === "object"
          ? serialize(value, keyName)
          : `${encodeURIComponent(keyName)}=${encodeURIComponent(value)}`
      );
    }
  }
  return str.join("&");
};
