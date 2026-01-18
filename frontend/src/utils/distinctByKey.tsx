export const distinctByKey = (array: Array<any>, key: string) => {
  const map = new Map();

  array.forEach((item) => {
    const value = item[key];
    
    if (map.has(value)) {
      // Merge with existing item - new data takes precedence
      map.set(value, { ...map.get(value), ...item });
    } else {
      map.set(value, item);
    }
  });

  return Array.from(map.values());
}