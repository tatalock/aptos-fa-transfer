import { IS_DEV } from '@/config';
import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import { defineStore } from 'pinia';

interface ClientStore {
  network: Ref<Network>;
  AptosClient: Ref<Aptos>;
  MizuClient: Ref<any>;
}

const useClientStore = defineStore('clientStore', (): ClientStore => {
  const network = ref<Network>(IS_DEV ? Network.TESTNET : Network.MAINNET);
  const AptosClient = computed(() => {
    return new Aptos(
      new AptosConfig({
        network: network.value,
      }),
    );
  });

  return {
    network,
    AptosClient,
  };
});

export default useClientStore;

