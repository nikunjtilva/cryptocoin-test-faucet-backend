import BitGoSDK from 'bitgo';

export const bitgo = new BitGoSDK.BitGo({ env: process.env.ENVIRONMENT, accessToken: process.env.ACCESS_TOKEN });

export const wallets = (cointype) => bitgo.coin(cointype).wallets();

export const getWalletByAddress = (cointype, address) => wallets(cointype).getWalletByAddress({ address: address });
