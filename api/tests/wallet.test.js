import * as wallet from '../wallet'
import * as bitgo from '../../config/bitgo'
import { COIN_MAP, COIN_TYPE, STATUS_CODE } from '../../constants';


describe('Wallet API: ', () => {
    const bitcoinWalletAddress = 'bitcoinwalletaddress';
    const litecoinWalletAddress = 'litecoinwalletaddress';
    beforeEach(() => {
        process.env.ACCESS_TOKEN = 'access_token';
        process.env.ENVIRONMENT = 'test';
        process.env.WALLET_PASS_PHRASE = 'passphrase';
        COIN_MAP[COIN_TYPE.BITCOIN].address = bitcoinWalletAddress;
        COIN_MAP[COIN_TYPE.LITECOIN].address = litecoinWalletAddress;
    });
    describe('Balance: ', () => {
        it('should call bitgo sdk to get wallet balance', () => {
            bitgo.getWalletByAddress = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve({ _wallet: { confirmedBalance: 1000 } });
            }));
            const events = {
                pathParameters: {
                    cointype: COIN_TYPE.BITCOIN
                }
            }
            const callback = () => {

            }
            wallet.balance(events, null, callback);
            expect(bitgo.getWalletByAddress).toHaveBeenCalledWith(COIN_TYPE.BITCOIN, bitcoinWalletAddress);
        });

        it('should throw error with status code 404 if coin type is not supported', async (done) => {
            const events = {
                pathParameters: {
                    cointype: 'mycoin'
                }
            }
            const callback = (args, response) => {
                expect(response.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
                done();
            }
            wallet.balance(events, null, callback);
        });

        it('should throw error with status code 400 if coin type is not provided', async (done) => {
            const events = {
                pathParameters: {
                }
            }
            const callback = (args, response) => {
                expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
                done();
            }
            wallet.balance(events, null, callback);
        });
        it('should send wallet information if proper input is available', async (done) => {

            bitgo.getWalletByAddress = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve({ _wallet: { confirmedBalance: 1000 } });
            }));
            const events = {
                pathParameters: {
                    cointype: COIN_TYPE.BITCOIN
                }
            }
            const callback = (args, response) => {
                response.body = JSON.parse(response.body);
                expect(response.body.balance).toEqual(1000);
                expect(response.body.walletAddress).toEqual(bitcoinWalletAddress);
                expect(response.body.unitDivisor).toEqual(COIN_MAP[events.pathParameters.cointype].unitDivisor);
                done();
            }
            wallet.balance(events, null, callback);
        });
        it('should raise error if error occur while fetching wallet information', () => {
            bitgo.getWalletByAddress = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                reject({ error: { message: 'unexpected error' } });
            }));
            const events = {
                pathParameters: {
                    cointype: COIN_TYPE.BITCOIN
                }
            }
            const callback = (args, response) => {
                expect(response.statusCode).toEqual(STATUS_CODE.SERVER_ERROR)
                done();
            }
            wallet.balance(events, null, callback);
        });

    });

    describe('Send Coin: ', () => {
        const receiverWalletAddress = 'receiverWalletAddress';
        const unitsToTransfer = 1000;
        it('should call bitgo sdk to send coins', async (done) => {

            const sendMock = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve({});
            }))
            const getWalletByAddressMock = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve({ _wallet: { confirmedBalance: 1000 }, send: sendMock });
            }));
            bitgo.getWalletByAddress = getWalletByAddressMock;

            const events = {
                pathParameters: {
                    cointype: COIN_TYPE.BITCOIN,
                    walletaddress: receiverWalletAddress,
                    amount: unitsToTransfer
                }
            }
            const callback = () => {
                expect(sendMock).toHaveBeenCalledWith({ address: receiverWalletAddress, amount: unitsToTransfer, walletPassphrase: process.env.WALLET_PASS_PHRASE });
                done();
            }
            wallet.sendCoin(events, null, callback);
        });
        it('should throw error with status code 404 if coin type is not supported', async (done) => {
            const events = {
                pathParameters: {
                    cointype: 'randomcoin',
                    walletaddress: receiverWalletAddress,
                    amount: unitsToTransfer
                }
            }
            const callback = (args, response) => {
                expect(response.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
                done();
            }
            wallet.sendCoin(events, null, callback);
        });
        it('should throw error with status code 400 if coin type is not provided', async (done) => {
            const events = {
                pathParameters: {
                }
            }
            const callback = (args, response) => {
                expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
                done();
            }
            wallet.sendCoin(events, null, callback);
        });
        it('should send requested coins to target wallet', async (done) => {

            const transactionInfo = {
                txid: "transactionID",
                tx: "transaction",
                status: "signed"
            };

            const sendMock = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve(transactionInfo);
            }))
            const getWalletByAddressMock = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve({ _wallet: { confirmedBalance: 1000 }, send: sendMock });
            }));
            bitgo.getWalletByAddress = getWalletByAddressMock;

            const events = {
                pathParameters: {
                    cointype: COIN_TYPE.BITCOIN,
                    walletaddress: receiverWalletAddress,
                    amount: unitsToTransfer
                }
            }
            const callback = (args, response) => {
                expect(response.body).toEqual(JSON.stringify(transactionInfo));
                expect(response.statusCode).toEqual(STATUS_CODE.OK);
                done();
            }
            wallet.sendCoin(events, null, callback);
        });
        it('should raise error if coins can not be transfered', async (done) => {
            const error = {
                message:'unexpected error'
            };

            const sendMock = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                reject(error);
            }))
            const getWalletByAddressMock = jest.fn().mockReturnValue(new Promise((resolve, reject) => {
                resolve({ _wallet: { confirmedBalance: 1000 }, send: sendMock });
            }));
            bitgo.getWalletByAddress = getWalletByAddressMock;

            const events = {
                pathParameters: {
                    cointype: COIN_TYPE.BITCOIN,
                    walletaddress: receiverWalletAddress,
                    amount: unitsToTransfer
                }
            }
            const callback = (args, response) => {
                expect(response.body).toEqual(JSON.stringify(error));
                expect(response.statusCode).toEqual(STATUS_CODE.SERVER_ERROR);
                done();
            }
            wallet.sendCoin(events, null, callback);
        });
    });

});