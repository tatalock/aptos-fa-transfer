import Token from '@/helpers/Token';
import { CURRENT_NETWORK } from '@/utils';
import { WalletCore } from '@aptos-labs/wallet-adapter-core';
import { OKXWallet } from '@okwallet/aptos-wallet-adapter';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { defineStore } from 'pinia';

interface AppStore {
  address: Ref<string | undefined>;
  publicKey: Ref<string | undefined>;
  connecting: Ref<boolean>;
  connectModalOpen: Ref<boolean>;
  autoConnect: Ref<boolean>;
  appInitialized: Ref<boolean>;
  priceUpdatedCount: Ref<number>;
  APT2USDT: Ref<number>;
  updateAddressAssets: () => Promise<void>;
  walletCore: WalletCore;
  tokenList: Ref<any[]>;
}

const WALLET_NAME = 'AptosWalletName';

const useAppStore = defineStore('appStore', (): AppStore => {
  const tokenList = ref<Token[]>([]);
  const address = ref();
  const publicKey = ref('');
  const autoConnect = ref(true);
  const connecting = ref(false);
  const connectModalOpen = ref(false);
  const priceUpdatedCount = ref(0);
  const APT2USDT = ref(0);

  const appInitialized = computed(() => {
    return priceUpdatedCount.value > 0;
  });

  const walletCore: any = new WalletCore(
    [new PetraWallet(), new OKXWallet()],
    ['Petra', 'Mizu Wallet'],
    {
      network: CURRENT_NETWORK as any,

      mizuwallet: {
        manifestURL: 'https://hyperfluid.xyz/hyperfluid-manifest.json',
      },
    },
  );

  const updateAddressAssets = async () => {
    if (!address.value) {
      tokenList.value.forEach((token: Token) => (token.balance = 0));
      return;
    }

    const result: any = await fetch(import.meta.env.VITE_APP_OFFICIAL_GRAPHQL_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        query: gql`
          query getCurrentFungibleAssetBalances {
            current_fungible_asset_balances(
              where: {
                owner_address: {
                  _eq: "${address.value}"
                }
              }
            ) {
              amount
              amount_v1
              amount_v2
              asset_type
              asset_type_v1
              asset_type_v2
            }
          }
        `,
        operationName: 'getCurrentFungibleAssetBalances',
      }),
    });

    const balances: any[] = (await result.json()).data?.current_fungible_asset_balances;

    balances?.map((balance: any) => {
      const index: number = tokenList.value.findIndex((token: Token) => {
        return token.coin_type == balance.asset_type || token.fa_type == balance.asset_type;
      });

      if (tokenList.value[index]) {
        tokenList.value[index].balance = balance.amount;
      }
    });
  };

  walletCore.on('accountChange', () => {
    address.value = walletCore.account?.address;
  });

  walletCore.on('connect', () => {
    window.localStorage.setItem(WALLET_NAME, walletCore.wallet?.name || '');
    address.value = walletCore.account?.address;
    publicKey.value = walletCore.account?.publicKey as string;

    if (address.value) {
      connectModalOpen.value = false;
    }

    walletCore.onAccountChange();
    walletCore.onNetworkChange();
  });

  walletCore.on('disconnect', () => {
    address.value = undefined;
  });

  if (autoConnect) {
    setTimeout(async () => {
      if (window.localStorage.getItem(WALLET_NAME)) {
        try {
          connecting.value = true;
          await walletCore.connect(window.localStorage.getItem(WALLET_NAME) as string);
          address.value = walletCore.account?.address;
        } catch (e: any) {
          console.log(e);
        } finally {
          connecting.value = false;
        }
      } else {
        connecting.value = false;
      }
    });
  }

  return {
    APT2USDT,
    autoConnect,
    connecting,
    connectModalOpen,
    address,
    publicKey,
    walletCore,
    tokenList,
    priceUpdatedCount,
    appInitialized,
    updateAddressAssets,
  };
});

export default useAppStore;

