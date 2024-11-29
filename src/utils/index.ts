import { toast } from '@/components/Toast';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import numeral from 'numeral';

dayjs.extend(utc);
export const dayUTC = dayjs.utc;

export const ShortAddress = (
  address: string,
  opts: { prefixLen: number; suffixLen: number } = { prefixLen: 6, suffixLen: 4 },
) => {
  const reg: RegExp = new RegExp(`(^\\S{${opts.prefixLen}})(\\S*)(\\S{${opts.suffixLen}})$`);
  return address && address !== '0' ? address.replace(reg, '$1...$3') : '';
};

export const copy = (text: string, message?: string) => {
  window.navigator.clipboard.writeText(text);
  toast({ content: message || 'Copied!', type: 'success' });
};

export const DATE_FORMAT = 'MMM D, YYYY HH:mm:ss';
export const DateFormat = (date: string | number, opt?: { utc?: boolean }) => {
  if (!date) return '-';
  if (opt?.utc) {
    dayjs.extend(utc);
    return dayjs.utc(date).local().format(DATE_FORMAT);
  } else return dayjs(date).format(DATE_FORMAT);
};

export const PercentFormat = (
  molecule: number | 'string' | BigNumber = 0,
  denominator: number | 'string' | BigNumber = 1,
) => {
  return new BigNumber(molecule).div(denominator).times(100).dp(2);
};

export const NumberFormat = (num: number | 'string' | BigNumber = 0) => {
  return new BigNumber(num).toFormat();
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const NumeralFormat = (num: number | string) => {
  return numeral(num).format('0.[0]a');
};

export const CURRENT_NETWORK = 'mainnet';
export const openExplorerAccount = (address: string) => {
  return `https://explorer.aptoslabs.com/account/${address}?network=${CURRENT_NETWORK}`;
};

export const openExplorerTxn = (hashOrVersion: string) => {
  return `https://explorer.aptoslabs.com/txn/${hashOrVersion}?network=${CURRENT_NETWORK}`;
};

export const stringToUint8Array = (str: string) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return bufView;
};

