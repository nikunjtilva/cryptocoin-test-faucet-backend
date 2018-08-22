import * as wallet from '../wallet'
import * as bitgo from '../../config/bitgo'
import { COIN_MAP,COIN_TYPE,STATUS_CODE } from '../../constants';


describe('Wallet API: ', () => {
    const bitcoinWalletAddress = 'bitcoinwalletaddress';
    const litecoinWalletAddress = 'litecoinwalletaddress';
    beforeEach(() => {
        process.env.ACCESS_TOKEN = 'access_token';
        process.env.ENVIRONMENT = 'test';
        COIN_MAP[COIN_TYPE.BITCOIN].address = bitcoinWalletAddress;
        COIN_MAP[COIN_TYPE.LITECOIN].address = litecoinWalletAddress;
    });
    describe('Balance: ', () => {
        it('should call bitgo sdk to get wallet balance', () => {
            bitgo.getWalletByAddress = jest.fn().mockReturnValue(new Promise((resolve,reject)=>{
                resolve({_wallet:{confirmedBalance:1000}});
            }));
            const events = {
                pathParameters:{
                    cointype:COIN_TYPE.BITCOIN
                }
            }
            const callback = ()=>{

            }
            wallet.balance(events,null,callback);
            expect(bitgo.getWalletByAddress).toHaveBeenCalledWith(COIN_TYPE.BITCOIN,bitcoinWalletAddress);
        });

        it('should throw error with status code 404 if coin type is not supported', async(done) => {
            const events = {
                pathParameters:{
                    cointype:'mycoin'
                }
            }
            const callback = (args,response)=>{
                expect(response.statusCode).toEqual(STATUS_CODE.NOT_FOUND);
                done();
            }
            wallet.balance(events,null,callback);
        });

        it('should throw error with status code 400 if coin type is not provided', async(done) => {
            const events = {
                pathParameters:{
                }
            }
            const callback = (args,response)=>{
                expect(response.statusCode).toEqual(STATUS_CODE.BAD_REQUEST);
                done();
            }
            wallet.balance(events,null,callback);
        });
        it('should send wallet information if proper input is available', async(done) => {

            bitgo.getWalletByAddress = jest.fn().mockReturnValue(new Promise((resolve,reject)=>{
                resolve({_wallet:{confirmedBalance:1000}});
            }));
            const events = {
                pathParameters:{
                    cointype:COIN_TYPE.BITCOIN
                }
            }
            const callback = (args,response)=>{
                response.body = JSON.parse(response.body);
                expect(response.body.balance).toEqual(1000);
                expect(response.body.walletAddress).toEqual(bitcoinWalletAddress);
                expect(response.body.unitDivisor).toEqual(COIN_MAP[events.pathParameters.cointype].unitDivisor);
                done();
            }
            wallet.balance(events,null,callback);
        });
        it('should raise error if error occur while fetching wallet information', () => {
            bitgo.getWalletByAddress = jest.fn().mockReturnValue(new Promise((resolve,reject)=>{
                reject({error:{message:'unexpected error'}});
            }));
            const events = {
                pathParameters:{
                    cointype:COIN_TYPE.BITCOIN
                }
            }
            const callback = (args,response)=>{
                expect(response.statusCode).toEqual(STATUS_CODE.SERVER_ERROR)                
                done();
            }
            wallet.balance(events,null,callback);
        });
        
    });

    describe('Send Coin: ', () => {
        it('should call bitgo sdk to send coins', () => {
            
        });
        it('should throw error with status code 404 if coin type is not supported', async(done) => {
        });
        it('should throw error with status code 400 if coin type is not provided', async(done) => {
        });
        it('should send requested coins to target wallet', async(done) => {
        });
        it('should raise error if coins can not be transfered', async(done) => {
        });
    });
   
});