export const str = 'The quick brown fox jumps over the lazy dog';
export const IS_STAGE = import.meta.env.MODE === 'staging';
export const IS_TEST = import.meta.env.MODE === 'test';
export const IS_DEV = import.meta.env.MODE !== 'production';

import { CURRENT_NETWORK } from '@/utils';
import { Aptos, AptosConfig } from '@aptos-labs/ts-sdk';

export const ACCESS_TOKEN_LS = 'access_token';
export const WALLET_ADDRESS_LS = 'wallet_address';

export const APTOS_COIN_TYPE = '0x1::aptos_coin::AptosCoin';
export const APT_DECIMALS = 8;
export const USDT_DECIMALS = 2;

export const AptosClient = new Aptos(
  new AptosConfig({
    network: CURRENT_NETWORK as any,
  }),
);

export const CONTRACT_ADDRESS = import.meta.env.VITE_APP_SWAP_CONTRACT;
export const GRAPHQL_ENDPOINT = import.meta.env.VITE_APP_GRAPHQL_ENDPOINT;

export type UpdateForType = 'from' | 'to' | '';

export const DEBOUNCE_DURATION = 300;

export const HASURA_ENDPOINT = 'https://api.mainnet.aptoslabs.com/v1/graphql';

