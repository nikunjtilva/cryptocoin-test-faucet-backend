import {COIN_TYPE} from './cointype'
export const COIN_MAP = {
    [COIN_TYPE.BITCOIN]:{address:process.env.TBTC_WALLET_ADDRESS,unitDivisor:100000000,unitName:'Satoshi'},
    [COIN_TYPE.LITECOIN]:{address:process.env.TLTC_WALLET_ADDRESS,unitDivisor:100000000,unitName:'Litoshi'}
}