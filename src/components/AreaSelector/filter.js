const filter = (data, level) => {
  if (level >= 3) {
    return data;
  }
  const newData = data.map(val => {
    const { children, ...other } = val;
    if (level === 1) {
      return { ...other };
    }
    const newChildren = children.map(child => {
      const { value, label, code } = child;
      return {
        value,
        label,
        code,
      };
    });
    return {
      ...other,
      children: newChildren,
    };
  });
  return newData;
};

export default filter;
