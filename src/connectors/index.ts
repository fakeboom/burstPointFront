import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from './NetworkConnector'
import { ChainId } from '@liuxingfeiyu/zoo-sdk'

export const RPC = {
  [ChainId.MAINNET]: 'https://mainnet.infura.io/v3/574c88a9425e47308ff624e2df66db12',
  [ChainId.ROPSTEN]: 'https://eth-ropsten.alchemyapi.io/v2/cidKix2Xr-snU3f6f6Zjq_rYdalKKHmW',
  [ChainId.RINKEBY]: 'https://eth-rinkeby.alchemyapi.io/v2/XVLwDlhGP6ApBXFz_lfv0aZ6VmurWhYD',
  [ChainId.GÖRLI]: 'https://eth-goerli.alchemyapi.io/v2/Dkk5d02QjttYEoGmhZnJG37rKt8Yl3Im',
  [ChainId.KOVAN]: 'https://eth-kovan.alchemyapi.io/v2/6OVAa_B_rypWWl9HqtiYK26IRxXiYqER',
  [ChainId.FANTOM]: 'https://rpcapi.fantom.network',
  [ChainId.FANTOM_TESTNET]: 'https://rpc.testnet.fantom.network',
  [ChainId.MATIC]: 'https://rpc-mainnet.maticvigil.com',
  [ChainId.MATIC_TESTNET]: 'https://rpc-mumbai.matic.today',
  [ChainId.XDAI]: 'https://rpc.xdaichain.com',
  [ChainId.BSC]: 'https://bsc-dataseed.binance.org/',
  [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  [ChainId.MOONBASE]: 'https://rpc.testnet.moonbeam.network',
  [ChainId.OKCHAIN_TEST]: 'http://test-okchain-provider.zooswap.net',
  [ChainId.OKCHAIN]: 'http://okexchain.okexcn.com:26659',
  [ChainId.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [ChainId.FUJI]: 'https://api.avax-test.network/ext/bc/C/rpc',
  [ChainId.HECO]: 'https://http-mainnet.hecochain.com',
  [ChainId.HECO_TESTNET]: 'https://http-testnet.hecochain.com',
  [ChainId.OASISETH_TEST]: 'https://testnet.emerald.oasis.dev',
  [ChainId.OASISETH_MAIN]: 'https://emerald.oasis.dev',
  [ChainId.OASISETH_SAPPHIRE]: 'https://testnet.sapphire.oasis.dev'
}

export const network = new NetworkConnector({
  defaultChainId: 1,
  urls: RPC
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const injected = new InjectedConnector({
  supportedChainIds: [
    1, // mainnet
    3, // ropsten
    4, // rinkeby
    5, // goreli
    42, // kovan
    250, // fantom
    4002, // fantom testnet
    137, // matic
    80001, // matic testnet
    100, // xdai
    56, // binance smart chain
    97, // binance smart chain testnet
    1287, // moonbase
    65 ,// okchain-test
    66 ,// okchain
    43114, // avalanche
    43113, // fuji
    128, // heco
    42261,//oasis test
    42262,//oasis main
    256, // heco testnet
    23295,
  ]
})
