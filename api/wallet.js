import * as bitgo from '../config/bitgo'
import { COIN_MAP, STATUS_CODE } from '../constants'
export const balance = (event, context, callback) => {
    const coinType = event.pathParameters.cointype;
    const coinProps = COIN_MAP[coinType];

    //validate input for bad request or not supported coins
    validateCoinType(coinType, callback);

    //call bitgo sdk to get wallet data
    bitgo.getWalletByAddress(coinType, coinProps.address)
        .then((wallet) => {
            callback(null,
                formatResponse(STATUS_CODE.OK, {
                    walletAddress: coinProps.address,
                    balance: wallet._wallet.confirmedBalance,
                    unitDivisor: coinProps.unitDivisor,
                    unitName: coinProps.unitName
                }))
        }, (error) => {
            callback(null, formatResponse(STATUS_CODE.SERVER_ERROR, { error: error }))
        })
}

export const sendCoin = (event, context, callback) => {
    const coinType = event.pathParameters.cointype;
    const receiversWalletAddress = event.pathParameters.walletaddress;
    const unitsToTransfer = event.pathParameters.amount;
    const coinProps = COIN_MAP[coinType];

    //validate input for bad request or not supported coins
    validateCoinType(coinType, callback);
    validateReceiversWalletAddress(receiversWalletAddress);

    bitgo.getWalletByAddress(coinType, coinProps.address)
        .then((wallet) => {
            const transactionInfo = {
                amount: unitsToTransfer,
                address: receiversWalletAddress,
                walletPassphrase: process.env.WALLET_PASS_PHRASE
            }
            wallet.send(transactionInfo).then((transaction) => {
                callback(null, formatResponse(STATUS_CODE.OK, transaction));
            }, (error) => {
                callback(null, formatResponse(error.status, error.result));
            })
        }, (error) => {
            callback(null, formatResponse(STATUS_CODE.SERVER_ERROR, { error: error }))
        })

}

const isCoinTypeSupported = (coinType) => {
    return COIN_MAP[coinType];
}

const formatResponse = (statusCode, body) => {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
}

const validateCoinType = (coinType, callback) => {
    //BAD REQUEST if coin type is not supplied
    !coinType && callback(null, formatResponse(STATUS_CODE.BAD_REQUEST, { message: 'bad request' }));
    //NOT FOUND if coin type is not available
    if (!isCoinTypeSupported(coinType)) {
        callback(null, formatResponse(STATUS_CODE.NOT_FOUND, { message: 'cointype not supported' }));
    }
}

const validateReceiversWalletAddress = (walletAddress, callback) => {
    //BAD REQUEST if coin type is not supplied
    !walletAddress && callback(null, formatResponse(STATUS_CODE.BAD_REQUEST, { message: 'bad request' }));
}
