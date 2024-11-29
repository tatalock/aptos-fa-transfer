import BigNumber from 'bignumber.js';
import { isNumber } from 'lodash-es';

export const NumericConstraint = (
  num: number | string | BigNumber,
  options: {
    decimals?: number;
    min?: number;
    max?: number;
  },
) => {
  let value: any = num.toString().replace(/[^\d.]/g, '');

  // Integer
  if (options.decimals == 0) {
    value = Number(value.replace(/\./g, '')).toString();
  }

  if (value.indexOf('.') > -1) {
    const p = value.split('.');
    value = [p[0], p[1].slice(0, options.decimals)].join('.');
  }

  if (isNumber(options.max) && BigNumber(value).isGreaterThan(options.max)) {
    value = options.max;
  } else if (isNumber(options.min) && BigNumber(value).isLessThan(options.min)) {
    value = options.min;
  }

  return value;
};

