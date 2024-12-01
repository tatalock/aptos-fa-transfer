<template>
  <Container class="flex-col items-center gap-2 p-20 py-30">
    <div
      class="max-w-500px mx-auto w-full bg-background/10 rounded-5 p-6 px-2"
      v-if="!appStore.address"
    >
      <div class="flex-col">
        <div
          class="flex items-center font-semibold p-4 rounded-md cursor-pointer hover:bg-white/5"
          v-for="(wallet, index) in appStore.walletCore.wallets"
          @click="connectWallet(wallet)"
          :key="index"
        >
          <div class="flex gap-2 items-center">
            <img :src="wallet.icon" class="w-8 h-8 rounded-full" />
            <span>{{ wallet.name }}</span>
          </div>
          <Button
            size="sm"
            :class="[
              { '!text-text/30': wallet.readyState !== WalletReadyState.Installed },
              'ml-auto',
            ]"
            :variant="wallet.readyState === WalletReadyState.Installed ? 'default' : 'text'"
          >
            {{ wallet.readyState }}
          </Button>
        </div>
      </div>
    </div>
    <!-- Body -->
    <div class="max-w-200 flex-col gap-4 w-full" v-else>
      <span class="flex items-center gap-2">
        <span class="text-btn-background font-semibold">{{ ShortAddress(appStore.address) }}</span>
        <span class="cursor-pointer" @click="copy(appStore.address, 'Address Copied')">
          <Copy :size="12" />
        </span>
      </span>

      <div class="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-4 sm:gap-10 w-full">
        <div class="bg-white/10 rounded-md flex-col max-h-200 overflow-y-auto">
          <!-- left -->
          <div
            class="flex-col p-3 px-4 hover:bg-btn-background/10 cursor-pointer group"
            v-for="asset in assets"
            :key="asset.amount"
            @click="() => (selectToken = asset)"
          >
            <span class="font-semibold text-btn-background">{{ asset?.metadata?.name }}</span>
            <span
              class="flex justify-between items-center text-xs text-text/50 group-hover:text-text"
            >
              <span>
                (Coin):
                <span class="font-semibold text-sm">
                  {{ Token.amountInDecimal(asset.amount_v1, asset.metadata.decimals) }}
                </span>
              </span>
              <span>
                (Fa):
                <span class="font-semibold text-sm">
                  {{ Token.amountInDecimal(asset.amount_v2, asset.metadata.decimals) }}
                </span>
              </span>
            </span>
          </div>
        </div>
        <!-- right -->
        <div class="flex-col bg-white/10 rounded-md flex-col gap-3 max-h-200 overflow-y-auto py-10">
          <template v-if="selectToken">
            <span class="font-semibold text-7 text-center px-2">
              Transfer
              <span class="text-btn-background">{{ selectToken?.metadata?.name }}</span>
            </span>
            <span class="text-center text-sm">
              Fa Balance:
              <span class="font-semibold text-base text-btn-background">
                {{ Token.amountInDecimal(selectToken.amount_v2, selectToken.metadata.decimals) }}
              </span>
            </span>

            <div class="mt-10"></div>
            <div class="flex-col px-4 gap-4">
              <label class="text-text/50 flex items-center gap-2 justify-between">
                Amount:
                <Button
                  size="xs"
                  @click="
                    amount = Token.amountInDecimal(
                      selectToken.amount_v2,
                      selectToken.metadata.decimals,
                    ).toString()
                  "
                >
                  MAX
                </Button>
              </label>
              <Input
                class="font-semibold"
                v-model:modelValue="amount"
                placeholder="0.00"
                :pattern="PATTERN.number(selectToken.metadata.decimals || 8)"
              />
              <label class="text-text/50">To:</label>
              <Input
                class="font-medium text-xs"
                v-model:modelValue="targetAddress"
                placeholder="0xabcd"
              />
              <Button :loading="approving" @click="approveHandler" size="lg">Approve</Button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Container>
</template>

<script lang="ts" setup>
  import { toast } from '@/components/Toast';
  import useWallets from '@/composable/useWallets';
  import { AptosClient, HASURA_ENDPOINT } from '@/config';
  import { AssetBalanceQuery } from '@/config/Queries';
  import Token from '@/helpers/Token';
  import Button from '@/lib/Button.vue';
  import Container from '@/lib/Container.vue';
  import Input, { PATTERN } from '@/lib/Input.vue';
  import useAppStore from '@/store/AppStore';
  import { copy, ShortAddress } from '@/utils';
  import { AccountAddress } from '@aptos-labs/ts-sdk';
  import { WalletReadyState } from '@aptos-labs/wallet-adapter-core';
  import request from 'graphql-request';
  import { Copy } from 'lucide-vue-next';

  const { connect } = useWallets();
  const appStore = useAppStore();
  const connectWallet = async (wallet: any) => {
    if (
      wallet.readyState === WalletReadyState.Installed ||
      wallet.readyState === WalletReadyState.Loadable
    ) {
      await connect(wallet.name);
    } else {
      window.open(wallet.url, '_blank');
    }
  };

  const assets = ref<any[]>([]);
  const updateAddressAssetsBalance = async () => {
    const ret: any = await request({
      url: HASURA_ENDPOINT,
      document: AssetBalanceQuery,
      variables: {
        address: appStore.address,
      },
    });

    assets.value = ret.current_fungible_asset_balances;
  };

  const selectToken = ref<any>();
  const amount = ref('');
  const targetAddress = ref('');

  const approving = ref(false);
  const approveHandler = async () => {
    if (approving.value) return;
    if (!selectToken.value || !targetAddress.value) return;

    if (
      !AccountAddress.isValid({
        input: targetAddress.value,
        strict: true,
      }).valid
    ) {
      toast({ content: 'Invalid address', type: 'error' });
      return;
    }

    const selectTokenInstance = new Token({
      name: selectToken.value.metadata.name,
      symbol: selectToken.value.metadata.symbol,
      decimals: selectToken.value.metadata.decimals,
      coin_type: selectToken.value.asset_type_v1,
      fa_type: selectToken.value.asset_type_v2,
    } as any);

    selectTokenInstance.faTypeCalculate();

    if (!selectTokenInstance.fa_type) {
      toast({ content: 'Token has not fa type', type: 'error' });
      return;
    }

    if (!amount.value || isNaN(Number(amount.value))) {
      toast({ content: 'Invalid amount', type: 'error' });
      return;
    }

    if (
      Token.amountInUnit(amount.value, selectToken.value.metadata.decimals).isGreaterThan(
        selectToken.value.amount_v2,
      )
    ) {
      toast({ content: 'Insufficient balance', type: 'error' });
      return;
    }

    try {
      approving.value = true;
      toast({ content: 'Approving...', type: 'info' });
      const { hash } = await appStore.walletCore.signAndSubmitTransaction({
        data: {
          function: `0x1::primary_fungible_store::transfer`,
          typeArguments: ['0x1::fungible_asset::Metadata'],
          functionArguments: [
            selectTokenInstance.fa_type,
            targetAddress.value,
            Token.amountInUnit(amount.value, selectToken.value.metadata.decimals).toString(),
          ],
        },
      });

      await AptosClient.waitForTransaction({
        transactionHash: hash,
      });
      toast({ content: 'Approve success', type: 'success' });
    } catch (e: any) {
      toast({ content: e.message, type: 'error' });
    } finally {
      approving.value = false;
    }
  };

  watch(
    () => appStore.address,
    () => {
      if (appStore.address) {
        updateAddressAssetsBalance();
      } else {
        assets.value = [];
      }
    },
    { immediate: true },
  );
</script>

<route lang="yaml">
meta:
  layout: default
</route>

