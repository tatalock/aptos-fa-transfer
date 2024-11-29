import { snackbarError } from '@/components/Snackbar';
import useAppStore from '@/store/AppStore';
import { WalletName } from '@aptos-labs/wallet-adapter-core';

const useWallets = () => {
  const appStore = useAppStore();
  const connecting = ref(false);

  const connect = async (walletName: WalletName) => {
    try {
      connecting.value = true;
      await appStore.walletCore?.connect(walletName);
    } catch (e: any) {
      console.log('connect error', e);
      snackbarError(e.message || e);
    } finally {
      connecting.value = false;
    }
  };

  const disconnect = async () => {
    try {
      await appStore.walletCore?.disconnect();
    } catch (e: any) {
      snackbarError(e.message);
    }
  };

  return {
    connecting,

    connect,
    disconnect,
  };
};

export default useWallets;

