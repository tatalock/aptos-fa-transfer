import { AptosClient } from '@/config';
import { AccountAddress } from '@aptos-labs/ts-sdk';
import Token from './Token';

function hex2a(hexx: number | string) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}
const pairedCoinToAssetType = (data: any) => {
  return [
    data.account_address,
    hex2a(data.module_name.replace('0x', '')),
    hex2a(data.struct_name.replace('0x', '')),
  ].join('::');
};

class TokenPairs {
  static IsCoinToken = (type: string) => type.split('::').length === 3;

  static AssetTypeEq = (
    token1AssetType: string | undefined,
    token2AssetType: string | undefined,
  ) => {
    if (!token1AssetType || !token2AssetType) return false;
    const [asset1, asset2] = [token1AssetType, token2AssetType].map((asset) => asset?.split('::'));

    if (!asset1 || !asset2) return false;
    if (asset1.length !== asset2.length) return false;

    if (asset1.length === 1) {
      return AccountAddress.from(asset1[0]).equals(AccountAddress.from(asset2[0]));
    }

    const [account_address, module_name, token_name] = asset1;
    const [account_address2, module_name2, token_name2] = asset2;
    return (
      `${AccountAddress.from(account_address).toStringLong()}::${module_name}::${token_name}` ===
      `${AccountAddress.from(account_address2).toStringLong()}::${module_name2}::${token_name2}`
    );
  };

  static PairsAssetTypeOrder = (
    tokenAssetPair: string[],
    tokenAssetPair2: string[],
  ): 'none' | 'asc' | 'desc' => {
    const [asset1, asset2] = tokenAssetPair;
    const [asset3, asset4] = tokenAssetPair2;
    if (TokenPairs.AssetTypeEq(asset1, asset3) && TokenPairs.AssetTypeEq(asset2, asset4)) {
      return 'asc';
    }
    if (TokenPairs.AssetTypeEq(asset1, asset4) && TokenPairs.AssetTypeEq(asset2, asset3)) {
      return 'desc';
    }
    return 'none';
  };

  static TokenCheck = (tokenPair: Token[]) => {
    if (tokenPair.length !== 2) {
      throw new Error('token pair length should be 2');
    }

    if (tokenPair.filter((token: any) => token.asset_type).length !== 2) {
      throw new Error('token pair should have asset_type');
    }
  };

  /**
   * Check coin pair
   *
   *
   * @param tokenPair
   * @param payloads [normal_entry, both_coins_entry, coin_entry]
   * @returns
   */
  static TokenPairTypeCheck = (tokenPair: Token[], payloads: any[]) => {
    // Both fa
    if (
      !TokenPairs.IsCoinToken(tokenPair[0].submitAssetType) &&
      !TokenPairs.IsCoinToken(tokenPair[1].submitAssetType)
    ) {
      console.log(1);
      return payloads[0];
    }

    // Both coin
    if (
      TokenPairs.IsCoinToken(tokenPair[0].submitAssetType) &&
      TokenPairs.IsCoinToken(tokenPair[1].submitAssetType)
    ) {
      return payloads[1];
    }

    //  coin and fa
    if (
      TokenPairs.IsCoinToken(tokenPair[0].submitAssetType) &&
      !TokenPairs.IsCoinToken(tokenPair[1].submitAssetType)
    ) {
      console.log(3);
      return payloads[2];
    }

    //  fa and coin
    if (
      !TokenPairs.IsCoinToken(tokenPair[0].submitAssetType) &&
      TokenPairs.IsCoinToken(tokenPair[1].submitAssetType)
    ) {
      console.log(4);
      return payloads[3];
    }
  };

  static FAAssetToCoin = async (asset: string) => {
    if (!asset) {
      throw new Error('asset is empty');
    }

    const result: any = await AptosClient.view({
      payload: {
        function: '0x1::coin::paired_coin',
        typeArguments: [],
        functionArguments: [asset],
      },
    });
    const rawCoinType = result?.[0].vec?.[0];
    // return coin type or fa type
    return rawCoinType ? pairedCoinToAssetType(rawCoinType) : asset;
  };
}

export default TokenPairs;

