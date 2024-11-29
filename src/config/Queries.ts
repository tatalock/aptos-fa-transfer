import { gql } from 'graphql-request';

export const AssetBalanceQuery = gql`
  query getCurrentFungibleAssetBalances($address: String, $offset: Int, $limit: Int) {
    current_fungible_asset_balances(
      where: { owner_address: { _eq: $address } }
      offset: $offset
      limit: $limit
    ) {
      amount
      asset_type
      is_frozen
      is_primary
      last_transaction_timestamp
      last_transaction_version
      owner_address
      storage_id
      token_standard
      metadata {
        icon_uri
        decimals
        creator_address
        asset_type
        name
        project_uri
        symbol
        token_standard
      }
      asset_type_v1
      asset_type_v2
      amount_v1
      amount_v2
    }
  }
`;

