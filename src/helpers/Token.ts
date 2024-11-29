import { AccountAddress } from '@aptos-labs/ts-sdk';
import BigNumber from 'bignumber.js';
import { functionIdToStringLong } from './TokenHelper';

BigNumber.config({
  EXPONENTIAL_AT: 20,
});

class Token {
  name: string = '';
  symbol: string = '';
  decimals: number = 8;
  price: number = 0;
  balance: number = 0;
  asset_type: `${string}::${string}::${string}` | string = '';
  logo_url?: string;
  isFa?: boolean;
  owener?: string;
  coingecko_id?: string;
  token_type: {
    account_address?: string;
    module_name?: string;
    struct_name?: string;
    type: string;
    fa_type?: string;
  } = { type: '', fa_type: '' };

  constructor(args: {
    name: string;
    symbol: string;
    decimals: number;
    asset_type: `${string}::${string}::${string}` | string;
    price?: number;
    balance?: number;
    logo_url?: string;
    isFa?: boolean;
    owener?: string;
    coingecko_id?: string;
    token_type?: {
      account_address?: string;
      module_name?: string;
      struct_name?: string;
      type: string;
    };
  }) {
    Object.assign(this, args);
  }

  //  == Display ==
  priceDisplay(amount: number | string | BigNumber, precision: number = 4) {
    return new BigNumber(this.price || 0)
      .times(amount || 0)
      .dp(precision)
      .toFormat();
  }

  priceDisplayWithSymbol(amount: number | string | BigNumber, precision: number = 4) {
    return `${this.priceDisplay(amount, precision)} ${this.symbol}`;
  }

  /**
   *
   * @param amount token amount in minimum unit (integer)
   * @param decimals target token decimals
   * @returns BigNumber
   *
   * @example
   * Token.amountInDecimal(100000000, 8) // 1
   * Token.amountInDecimal(100000000, 6) // 100
   */
  static amountInDecimal(amount: number | string | BigNumber, decimals: number = 8): BigNumber {
    return new BigNumber(amount || 0).shiftedBy(-1 * decimals);
  }

  /**
   *
   * @param amount token amount in decimal
   * @param decimals  target token decimals
   * @returns BigNumber
   *
   * @example
   * Token.amountInUnit(1, 8) // 100000000
   * Token.amountInUnit(100, 6) // 100000000
   */
  static amountInUnit(amount: number | string | BigNumber, decimals: number = 8): BigNumber {
    return new BigNumber(amount || 0).shiftedBy(decimals);
  }

  /**
   *
   * @param balance token balance in minimum unit
   * @param token Token
   * @returns token balance in decimal
   *
   * @example
   * Token.balanceInDecimal(100000000, token) // 1
   */
  static balanceInUSDT(balance: number, token: Token): string {
    const usd: BigNumber = new BigNumber(balance || 0)
      .shiftedBy(-1 * token.decimals)
      .times(token.price);

    if (BigNumber(usd).isEqualTo(0)) return '$0';
    return BigNumber(usd).isLessThan(0.001) ? '< $0.001' : `$ ${usd.dp(3).toFormat()}`;
  }

  /**
   *
   * @param balance token balance in minimum unit
   * @param token Token
   * @returns token balance in decimal
   *
   * @example
   * Token.balanceInDecimal(100000000, token) // 1
   */
  currentBalanceInUSDT(): string {
    return Token.balanceInUSDT(this.balance, this);
  }

  /**
   *
   * @returns token balance in decimal
   *
   * @example
   * const token = new Token({balance: 100000000, decimals: 8})
   *
   * token.balanceInDecimal() // 1
   */
  balanceInDecimal(): BigNumber {
    return Token.amountInDecimal(this.balance, this.decimals);
  }

  /**
   *
   * @returns token balance in display format, with comma and decimal
   *
   * @example
   * const token = new Token({balance: 12345678900000, decimals: 8})
   *
   * token.balanceDisplay() // 12,345.6789
   */
  balanceDisplay(): string {
    return new BigNumber(this.balance || 0).shiftedBy(-1 * this.decimals).toFormat();
  }

  /**
   *
   * @returns token balance in display format with symbol, with comma and decimal
   *
   * @exmaple
   * const token = new Token({balance: 12345678900000, decimals: 8})
   *
   * token.balanceDisplayWithSymbol() // 12,345.6789 APT
   */
  balanceDisplayWithSymbol(): string {
    return `${this.balanceDisplay()} ${this.symbol}`;
  }

  /**
   *
   * @param amount token amount in minimum unit
   * @returns
   *
   * @example
   * const token = new Token({balance: 100000000, decimals: 8})
   *
   * token.isInsufficientBalance(100000001) // true
   * token.isInsufficientBalance(100000000) // false
   */
  isInsufficientBalance(amount: number | string | BigNumber) {
    return new BigNumber(this.balance).isLessThan(amount);
  }

  /**
   *
   * @param amount token amount in decimal
   * @returns
   *
   * @example
   * const token = new Token({balance: 1, decimals: 8})
   *
   * token.isInsufficientBalanceWithDecimal(1.00000001) // true
   * token.isInsufficientBalanceWithDecimal(1) // false
   */
  isInsufficientBalanceWithDecimal(amount: number | string | BigNumber) {
    return this.balanceInDecimal().isLessThan(amount);
  }

  /**
   * Get token type in string
   *
   * @returns token type in string
   */
  get faType() {
    const type = this.token_type.fa_type || this.token_type.type;
    if (type.split('::').length == 3) {
      const [account_address, module_name, token_name] = type.split('::');
      return `${AccountAddress.from(
        account_address,
      ).toStringLong()}::${module_name}::${token_name}`;
    } else if (type) {
      return AccountAddress.from(this.token_type.fa_type || this.token_type.type).toStringLong();
    }
  }

  isEqualFaType(token: Token) {
    return this.faType === token.faType;
  }

  isTheToken(type: string) {
    return functionIdToStringLong(this.token_type.type) === functionIdToStringLong(type);
  }

  removeOwenr() {
    this.owener = '';
    this.clearBalance();
  }

  clearBalance() {
    this.balance = 0;
  }
}

export default Token;

