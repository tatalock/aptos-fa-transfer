import { APTOS_COIN_TYPE, USDT_DECIMALS } from '@/config';
import { stringToUint8Array } from '@/utils';
import { AccountAddress, createObjectAddress, Serializer } from '@aptos-labs/ts-sdk';
import BigNumber from 'bignumber.js';
import { functionIdToStringLong } from './TokenHelper';
import TokenPairs from './TokenPairs';

BigNumber.config({
  EXPONENTIAL_AT: [-20, 20],
});

class Token {
  name: string = '';
  symbol: string = '';
  hyperfluid_symbol: string = '';
  decimals: number = 8;
  index: number | string = '';
  tags: string[] = [];
  bridge: string = '';
  price: number | string = 0;
  priceU: number | string = 0;
  balance: number = 0;
  asset_type: `${string}::${string}::${string}` | string = '';
  coin_type?: `${string}::${string}::${string}` | string = '';
  fa_type?: string = '';
  logo_url?: string;
  logoUrl?: string;
  isFa?: boolean;
  owener?: string;
  coingecko_id?: string;
  coinMarketcapId?: string;
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
    hyperfluid_symbol?: string;
    decimals: number;
    asset_type: `${string}::${string}::${string}` | string;
    coin_type?: `${string}::${string}::${string}` | string;
    fa_type?: string;
    index?: number | string;
    tags?: string[];
    bridge?: string;
    price?: number | string;
    priceU?: number | string;
    balance?: number;
    logo_url?: string;
    isFa?: boolean;
    owener?: string;
    coingecko_id?: string;
    coinMarketcapId?: string;
    token_type?: {
      account_address?: string;
      module_name?: string;
      struct_name?: string;
      type: string;
    };
  }) {
    Object.assign(this, args);
    this.faTypeCalculate();
  }

  faTypeCalculate() {
    if (!this.coin_type) return;

    // APT
    if (TokenPairs.AssetTypeEq(this.coin_type, APTOS_COIN_TYPE)) {
      this.fa_type = '0xa';
      return;
    }

    const [contractAddress, moduleName, functionName] = this.coin_type.split('::');
    const shortContractAddress = [
      AccountAddress.from(contractAddress).toString(),
      moduleName,
      functionName,
    ].join('::');

    const ser = new Serializer();
    ser.serializeFixedBytes(stringToUint8Array(shortContractAddress));
    const faType = createObjectAddress(AccountAddress.from('0xa'), ser.toUint8Array());
    this.fa_type = faType.toString();
  }

  //  == Display ==
  priceDisplay(amount: number | string | BigNumber, precision: number = 4) {
    return new BigNumber(this.price || 0)
      .times(amount || 0)
      .dp(precision)
      .toFormat();
  }

  priceDisplayWithSymbol(amount: number | string | BigNumber, precision: number = 4) {
    return `${this.priceDisplay(amount, precision)} ${this.hyperfluid_symbol}`;
  }

  priceInUSDT(APTPrice: number | BigNumber = 0) {
    return new BigNumber(this.price || 0).times(APTPrice).dp(USDT_DECIMALS).toNumber();
  }

  volumeInUSDT(APTPrice: number | BigNumber = 0) {
    return Token.amountInDecimal(this.balance, this.decimals)
      .times(this.priceInUSDT(APTPrice))
      .dp(USDT_DECIMALS)
      .toString();
  }

  volumeInUSDTByBalance(
    balance: string | number | BigNumber = 0,
    APTPrice: number | BigNumber = 0,
  ) {
    return (
      new BigNumber(balance || 0).times(this.priceInUSDT(APTPrice)).dp(USDT_DECIMALS).toString() ||
      0
    );
  }

  get submitAssetType() {
    return this.coin_type || this.fa_type || '';
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
    return `${this.balanceDisplay()} ${this.hyperfluid_symbol}`;
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

