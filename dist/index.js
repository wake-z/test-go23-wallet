"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};


var _HDWalletProvider_wallets, _HDWalletProvider_addresses;
const bip39_1 = require("ethereum-cryptography/bip39");
const english_1 = require("ethereum-cryptography/bip39/wordlists/english");
const EthUtil = __importStar(require("ethereumjs-util"));
const tx_1 = require("@ethereumjs/tx");
const common_1 = __importDefault(require("@ethereumjs/common"));
const web3_provider_engine_1 = __importDefault(require("go23-provider-engine"));
// @ts-ignore - web3-provider-engine doesn't have declaration files for these subproviders
const filters_1 = __importDefault(require("go23-provider-engine/subproviders/filters"));
// @ts-ignore
const nonce_tracker_1 = __importDefault(require("go23-provider-engine/subproviders/nonce-tracker"));
// @ts-ignore
const hooked_wallet_1 = __importDefault(require("go23-provider-engine/subproviders/hooked-wallet"));
// @ts-ignore
const provider_1 = __importDefault(require("go23-provider-engine/subproviders/provider"));
// @ts-ignore
const rpc_1 = __importDefault(require("go23-provider-engine/subproviders/rpc"));
// @ts-ignore
const websocket_1 = __importDefault(require("go23-provider-engine/subproviders/websocket"));
const url_1 = __importDefault(require("url"));
const getOptions_1 = require("./constructor/getOptions");
const getPrivateKeys_1 = require("./constructor/getPrivateKeys");
const getMnemonic_1 = require("./constructor/getMnemonic");
const eth_sig_util_1 = require("@metamask/eth-sig-util");
const hdwallet_1 = require("@truffle/hdwallet");
const Postmate = require('./constructor/postmate')
// Important: do not use debug module. Reason: https://github.com/trufflesuite/truffle/issues/2374#issuecomment-536109086
// This line shares nonce state across multiple provider instances. Necessary
// because within truffle the wallet is repeatedly newed if it's declared in the config within a
// function, resetting nonce from tx to tx. An instance can opt out
// of this behavior by passing `shareNonce=false` to the constructor.
// See issue #65 for more
const URL = 'http://new.wallet.metaderby.fe.test.dbytothemoon.com/';
const IFRAME_NAME = '__go23-wallet-iframe__';

let handshake;

function createIframe({url = URL, name= IFRAME_NAME, fn = '', options = '', cb = ''}) {
    if (!handshake) {
        console.log('create')
        console.log(222)
        handshake = new Postmate({
            container: document.body,
            url: url,
            name: name
        })
    } else {
        console.log('show')
        show()
    }

    var p = new Promise(function(resolve, reject) {
        console.log(333)
        handshake.then(child => {
            child.call(fn, options);
            child.on(cb, data => {
                resolve(data)
            });
        });
    })
    return p
}

// let handshake;
var createAccount = async () => {
    const res = await createIframe({
        url: 'http://new.wallet.metaderby.fe.test.dbytothemoon.com/login',
        name: IFRAME_NAME,
        fn: 'createAccount',
        options: 'createAccount',
        cb: 'createAccountCb'
    })
    return res
}

var connectAccount = async (options) => {
    const res = await createIframe({
        url: 'http://localhost:3000',
        name: IFRAME_NAME,
        fn: 'connectAccount',
        options: options,
        cb: 'connectAccountCb'
    })
    return res
}

var getAccount = async (options) => {
    const res = await createIframe({
        url: 'http://localhost:3000',
        name: IFRAME_NAME,
        fn: 'getAccount',
        options: options,
        cb: 'getAccountCb'
    })
    return res
}

var useSignMessage = async () => {
    const res = await createIframe({
        url: 'http://new.wallet.metaderby.fe.test.dbytothemoon.com/sign',
        name: IFRAME_NAME,
        fn: 'signMessage',
        options: 'signMessage',
        cb: 'signMessageCb'
    })
    return res
}

var useSignTransaction = async (txParams) => {
    const res = await createIframe({
        url: 'http://new.wallet.metaderby.fe.test.dbytothemoon.com/deal',
        name: IFRAME_NAME,
        fn: 'signTransaction',
        options: txParams,
        cb: 'signTransactionCb'
    })
    return res
}

function destroy() {
    const self = document.getElementsByName(IFRAME_NAME)[0]
    // self.remove();
    self.style.display="none";
}
function show() {
    const self = document.getElementsByName(IFRAME_NAME)[0]
    // self.remove();
    self.style.display="block"
}

const singletonNonceSubProvider = new nonce_tracker_1.default();
class HDWalletProvider {
    constructor(...args) {
        this.providerToUse = 'https://avalanche-fuji.infura.io/v3/4f37e70b04cc454ca72bc5cc5a6c02ef'
    }
    async enable() {
        const userData = {
            userEmail: 'allen@metaderby.com',
            type: 'email',
            uniqueId: 'allen@metaderby.com'
        }
        const res = await connectAccount(userData)
        console.log('enable====', res)
        const { action, address } = res
        destroy()
        if (action !== 'confirm') {
            console.log('verify 取消')
            return
        }

        this.engine = new web3_provider_engine_1.default({
            pollingInterval: 4000
        });
        let providerToUse = this.providerToUse;
        this.initialized = this.initialize();
        
        this.engine.addProvider(new hooked_wallet_1.default({
            async getWakeAccounts(cb) {
                cb(null, address);
            },
            getAccounts(cb) {
                console.log('getAccounts==================')
                cb(null, address);
            },
            // getPrivateKey(address, cb) {
            //     console.log('getPrivateKey==================')
            //     if (!tmpWallets[address]) {
            //         cb("Account not found");
            //         return;
            //     }
            //     else {
            //         cb(null, tmpWallets[address].toString("hex"));
            //     }
            // },
            // signTransaction (txParams, cb) {
            //     console.log('signTransaction==================', txParams)
            //     useSignTransaction(txParams).then(res => {
            //         console.log('useSignTransaction====', res)
            //         const { action } = res
            //         destroy()
            //         if (action !== 'confirm') {
            //             return
            //         }
            //         return __awaiter(this, void 0, void 0, function* () {
            //             yield self.initialized;
            //             // we need to rename the 'gas' field
            //             txParams.gasLimit = txParams.gas;
            //             delete txParams.gas;
            //             let pkey;
            //             const from = txParams.from.toLowerCase();
            //             if (tmpWallets[from]) {
            //                 pkey = tmpWallets[from];
            //             }
            //             else {
            //                 cb("Account not found");
            //                 return;
            //             }
            //             const chain = self.chainId;
            //             const KNOWN_CHAIN_IDS = new Set([1, 3, 4, 5, 42]);
            //             let txOptions;
            //             if (typeof chain !== "undefined" && KNOWN_CHAIN_IDS.has(chain)) {
            //                 txOptions = {
            //                     common: new common_1.default({ chain, hardfork: self.hardfork })
            //                 };
            //             }
            //             else if (typeof chain !== "undefined") {
            //                 txOptions = {
            //                     common: common_1.default.forCustomChain(1, {
            //                         name: "custom chain",
            //                         chainId: chain
            //                     }, self.hardfork)
            //                 };
            //             }
            //             // Taken from https://github.com/ethers-io/ethers.js/blob/2a7ce0e72a1e0c9469e10392b0329e75e341cf18/packages/abstract-signer/src.ts/index.ts#L215
            //             const hasEip1559 = txParams.maxFeePerGas !== undefined ||
            //                 txParams.maxPriorityFeePerGas !== undefined;
            //             const tx = hasEip1559
            //                 ? tx_1.FeeMarketEIP1559Transaction.fromTxData(txParams, txOptions)
            //                 : tx_1.Transaction.fromTxData(txParams, txOptions);
            //             const signedTx = tx.sign(pkey);
            //             const rawTx = `0x${signedTx.serialize().toString("hex")}`;
            //             cb(null, rawTx);
            //         });
            //     })
            // },
            async signMessage({ data, from }, cb) {
                const res = await useSignMessage()
                console.log('9999999', res)
                cb(null, '12312321');
            },
            signPersonalMessage(...args) {
                this.signMessage(...args);
            },
            // signTypedMessage({ data, from }, cb) {
            //     console.log('signTypedMessage=====================')
            //     if (!data) {
            //         cb("No data to sign");
            //         return;
            //     }
            //     // convert address to lowercase in case it is in checksum format
            //     const fromAddress = from.toLowerCase();
            //     if (!tmpWallets[fromAddress]) {
            //         cb("Account not found");
            //         return;
            //     }
            //     const signature = (0, eth_sig_util_1.signTypedData)({
            //         data: JSON.parse(data),
            //         privateKey: tmpWallets[fromAddress],
            //         version: eth_sig_util_1.SignTypedDataVersion.V4
            //     });
            //     cb(null, signature);
            // }
        }));
        this.engine.addProvider(singletonNonceSubProvider);
        this.engine.addProvider(new filters_1.default());
        if (typeof providerToUse === "string") {
            const url = providerToUse;
            const providerProtocol = (url_1.default.parse(url).protocol || "http:").toLowerCase();
            switch (providerProtocol) {
                case "ws:":
                case "wss:":
                    this.engine.addProvider(new websocket_1.default({ rpcUrl: url }));
                    break;
                default:
                    this.engine.addProvider(new rpc_1.default({ rpcUrl: url }));
            }
        }
        else {
            this.engine.addProvider(new provider_1.default(providerToUse));
        }
        // Required by the provider engine.
        this.engine.start();
        console.log('============== login success ==============')
        return address
    }
    initialize() {
        return new Promise((resolve, reject) => {
            this.engine.sendAsync({
                jsonrpc: "2.0",
                id: Date.now(),
                method: "eth_chainId",
                params: []
            }, 
            // @ts-ignore - the type doesn't take into account the possibility
            // that response.error could be a thing
            (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                else if (response.error) {
                    reject(response.error);
                    return;
                }
                if (isNaN(parseInt(response.result, 16))) {
                    const message = "When requesting the chain id from the node, it" +
                        `returned the malformed result ${response.result}.`;
                    throw new Error(message);
                }
                this.chainId = parseInt(response.result, 16);
                resolve();
            });
        });
    }
    // private helper to check if given mnemonic uses BIP39 passphrase protection
    checkBIP39Mnemonic({ addressIndex, numberOfAddresses, phrase, password }) {
        if (!(0, bip39_1.validateMnemonic)(phrase, english_1.wordlist)) {
            throw new Error("Mnemonic invalid or undefined");
        }
        const hdwallet = (0, hdwallet_1.createAccountGeneratorFromSeedAndPath)((0, bip39_1.mnemonicToSeedSync)(phrase, password), this.walletHdpath.replace(/\/$/, "").split("/"));
        // crank the addresses out
        for (let i = addressIndex; i < addressIndex + numberOfAddresses; i++) {
            const wallet = hdwallet(i);
            const addr = `0x${Buffer.from((0, hdwallet_1.uncompressedPublicKeyToAddress)(wallet.publicKey)).toString("hex")}`;
            __classPrivateFieldGet(this, _HDWalletProvider_addresses, "f").push(addr);
            __classPrivateFieldGet(this, _HDWalletProvider_wallets, "f")[addr] = wallet.privateKey;
        }
    }
    // private helper leveraging ethUtils to populate wallets/addresses
    ethUtilValidation({ addressIndex, privateKeys }) {
        // crank the addresses out
        for (let i = addressIndex; i < privateKeys.length; i++) {
            const privateKey = Buffer.from(privateKeys[i].replace("0x", ""), "hex");
            if (EthUtil.isValidPrivate(privateKey)) {
                const wallet = EthUtil.privateToAddress(privateKey);
                const address = `0x${wallet.toString("hex")}`;
                __classPrivateFieldGet(this, _HDWalletProvider_addresses, "f").push(address);
                __classPrivateFieldGet(this, _HDWalletProvider_wallets, "f")[address] = privateKey;
            }
        }
    }
    send(payload, 
    // @ts-ignore we patch this method so it doesn't conform to type
    callback) {
        this.initialized.then(() => {
            this.engine.sendAsync(payload, callback);
        });
    }
    sendAsync(payload, callback) {
        this.initialized.then(() => {
            this.engine.sendAsync(payload, callback);
        });
    }
    getAddress(idx) {
        if (!idx) {
            return __classPrivateFieldGet(this, _HDWalletProvider_addresses, "f")[0];
        }
        else {
            return __classPrivateFieldGet(this, _HDWalletProvider_addresses, "f")[idx];
        }
    }
    getAddresses() {
        return __classPrivateFieldGet(this, _HDWalletProvider_addresses, "f");
    }
    static isValidProvider(provider) {
        if (!provider)
            return false;
        if (typeof provider === "string") {
            const validProtocols = ["http:", "https:", "ws:", "wss:"];
            const url = url_1.default.parse(provider.toLowerCase());
            return !!(validProtocols.includes(url.protocol || "") && url.slashes);
        }
        else if ("request" in provider) {
            // provider is an 1193 provider
            return true;
        }
        else if ("send" in provider) {
            // provider is a "legacy" provider
            return true;
        }
        return false;
    }
}
_HDWalletProvider_wallets = new WeakMap(), _HDWalletProvider_addresses = new WeakMap();
module.exports = HDWalletProvider;
//# sourceMappingURL=index.js.map