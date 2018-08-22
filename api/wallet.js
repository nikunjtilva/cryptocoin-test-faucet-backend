import * as bitgo from '../config/bitgo'
import {COIN_MAP,STATUS_CODE} from '../constants'
export const balance =  (event, context, callback) => {
    const coinType = event.pathParameters.cointype;
    const coinProps = COIN_MAP[coinType];
    
    //validate input for bad request or not supported coins
    validateInputs(coinType, callback);

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

export const sendCoin = (event,context,callback) => {
    const coinType = event.pathParameters.cointype;
    const coinProps = COIN_MAP[coinType];
    
    //validate input for bad request or not supported coins
    validateInputs(coinType, callback);

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

function validateInputs(coinType, callback) {
    //BAD REQUEST if coin type is not supplied
    !coinType && callback(null, formatResponse(STATUS_CODE.BAD_REQUEST, { message: 'bad request' }));
    //NOT FOUND if coin type is not available
    if (!isCoinTypeSupported(coinType)) {
        callback(null, formatResponse(STATUS_CODE.NOT_FOUND, { message: 'cointype not supported' }));
    }
}

