const parses = {
  default: value => value,
  int: value => parseInt(value, 10),
  array: value => {
    if (value && value.length > 0) {
      return value;
    }
    return undefined;
  },
  like: value => value && ['like', value],
  in: value => {
    if (value && value.length > 0) {
      return ['in', value];
    }
    return undefined;
  },
  money: value => value && value * 100,
  date: moment => moment && moment.format('YYYY-MM-DD 00:00:00'),
  dateLike: moment => moment && ['like', moment.format('YYYY-MM-DD 00:00:00')],
  dateIn: moment => moment && ['in', [moment.format('YYYY-MM-DD 00:00:00')]],
  dateRange: value => {
    if (value && value.length > 0) {
      const [min, max] = value;
      return {
        min: min.format('YYYY-MM-DD 00:00:00'),
        max: max.format('YYYY-MM-DD 23:59:59'),
      };
    }
    return undefined;
  },
  dateRangeArray: value => {
    if (value && value.length > 0) {
      const [min, max] = value;
      return [min.format('YYYY-MM-DD 00:00:00'), max.format('YYYY-MM-DD 23:59:59')];
    }
    return undefined;
  },
};

const chooseParse = parse => {
  const T = typeof parse;
  if (T === 'function') {
    return parse;
  }
  if (T === 'string') {
    return parses[parse] || parses.default;
  }
  return parses.default;
};

export default chooseParse;
