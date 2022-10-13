import { ChainId, JSBI, Percent, Token, WETH ,SUSHI_ADDRESS,DefaultChainToken} from '@liuxingfeiyu/zoo-sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { EnumParams } from 'ajv'
import { chain } from 'lodash'

import {injected, RPC} from '../connectors'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export { PRELOADED_PROPOSALS } from './proposals'

export {
  ZOO_USDT_SWAP_PAIR_ADDRESS,
  ZOO_SWAP_MINING_ADDRESS,
  ZOO_PARK_ADDRESS,
  ZOO_PARK_EXT_ADDRESS
} from '@liuxingfeiyu/zoo-sdk'
// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

type ChainTokenMap = {
  readonly [chainId in ChainId]?: Token
}

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const GOVERNANCE_ADDRESS = '0x5e4be8Bc9637f0EAA1A755019e06A68ce081D58F'
export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

export const XYUZU_LIST : ChainTokenMap = {
  [ChainId.OASISETH_TEST] : new Token(ChainId.OASISETH_TEST, '0xd2101c6d3182e4C3BbcAB79257fDdD02D0a714bb', 18, 'XYUZU', 'XYUZU'),
  [ChainId.OASISETH_MAIN] : new Token(ChainId.OASISETH_MAIN, '0xf5493ea940d12cE8594f81BaB2bB7d4ed81d49e8', 18, 'XYUZU', 'XYUZU')
}
// SUSHI
export const SUSHI: ChainTokenMap = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    18,
    'SUSHI',
    'SushiToken'
  ),
  [ChainId.ROPSTEN]:  DefaultChainToken[ChainId.ROPSTEN].YUZU,
  [ChainId.OASISETH_TEST]:  DefaultChainToken[ChainId.OASISETH_TEST].YUZU,
  [ChainId.OASISETH_MAIN]:  DefaultChainToken[ChainId.OASISETH_MAIN].YUZU,
  [ChainId.RINKEBY]: new Token(
    ChainId.RINKEBY,
    '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
    18,
    'SUSHI',
    'SushiToken'
  ),
  [ChainId.GÖRLI]: new Token(ChainId.GÖRLI, '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 18, 'SUSHI', 'SushiToken'),
  [ChainId.KOVAN]: new Token(ChainId.KOVAN, '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F', 18, 'SUSHI', 'SushiToken'),
  [ChainId.FANTOM]: new Token(ChainId.KOVAN, '0xae75A438b2E0cB8Bb01Ec1E1e376De11D44477CC', 18, 'SUSHI', 'SushiToken'),
  [ChainId.OKCHAIN_TEST]: new Token(ChainId.OKCHAIN_TEST, SUSHI_ADDRESS[ChainId.OKCHAIN_TEST] , 18, 'ZOO', 'ZooToken'),
  [ChainId.OKCHAIN]: new Token(ChainId.OKCHAIN, '0xB81989Ed7006F29E35f5253dBEcb0f02F2353eDE', 18, 'SUSHI', 'SushiToken')

}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  // [UNI_ADDRESS]: 'UNI',
  [GOVERNANCE_ADDRESS]: 'Governance',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.FANTOM]: [WETH[ChainId.FANTOM]],
  [ChainId.FANTOM_TESTNET]: [WETH[ChainId.FANTOM_TESTNET]],
  [ChainId.MATIC]: [WETH[ChainId.MATIC]],
  [ChainId.MATIC_TESTNET]: [WETH[ChainId.MATIC_TESTNET]],
  [ChainId.XDAI]: [WETH[ChainId.XDAI]],
  [ChainId.BSC]: [WETH[ChainId.BSC]],
  [ChainId.BSC_TESTNET]: [WETH[ChainId.BSC_TESTNET]],
  [ChainId.OKCHAIN]: [WETH[ChainId.OKCHAIN]],
  [ChainId.OKCHAIN_TEST]: [WETH[ChainId.OKCHAIN_TEST]],
  [ChainId.OKCHAIN]: [WETH[ChainId.OKCHAIN]],
  [ChainId.OKCHAIN_TEST]: [WETH[ChainId.OKCHAIN_TEST]],
  [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
  [ChainId.MOONBASE]: [WETH[ChainId.MOONBASE]],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
  [ChainId.FUJI]: [WETH[ChainId.FUJI]],
  [ChainId.HECO]: [WETH[ChainId.HECO]],
  [ChainId.HECO_TESTNET]: [WETH[ChainId.HECO_TESTNET]],
  [ChainId.HECO_TESTNET]: [WETH[ChainId.HECO_TESTNET]],
  [ChainId.OASISETH_MAIN]: [WETH[ChainId.OASISETH_MAIN]],
  [ChainId.OASISETH_TEST]: [WETH[ChainId.OASISETH_TEST]],
  [ChainId.OASISETH_SAPPHIRE]: [WETH[ChainId.OASISETH_SAPPHIRE]]
}

// Default Ethereum chain tokens
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BSC, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BSC, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BSC, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BSC, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BSC, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin')
}

export const FANTOM: { [key: string]: Token } = {
  USDC: new Token(ChainId.FANTOM, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FANTOM, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FANTOM, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.FANTOM, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
}


export const OKCHAIN_TEST  = DefaultChainToken[ChainId.OKCHAIN_TEST]
export const ROPSTEN_TOKENS = DefaultChainToken[ChainId.ROPSTEN]
export const OASISETH_TEST_TOKENS = DefaultChainToken[ChainId.OASISETH_TEST]
export const OASISETH_MAIN_TOKENS = DefaultChainToken[ChainId.OASISETH_MAIN]
export const AllDefaultChainTokens = DefaultChainToken



// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC, RUNE],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
  [ChainId.OASISETH_TEST]: [...WRAPPED_NATIVE_ONLY[ChainId.OASISETH_TEST], OASISETH_TEST_TOKENS.YUZU,OASISETH_TEST_TOKENS.BTC,OASISETH_TEST_TOKENS.ETH,OASISETH_TEST_TOKENS.USDT],
  [ChainId.OASISETH_MAIN]: [...WRAPPED_NATIVE_ONLY[ChainId.OASISETH_MAIN], OASISETH_MAIN_TOKENS.YUZU,OASISETH_MAIN_TOKENS.ETH,OASISETH_MAIN_TOKENS.USDT],
}

export const CREAM = new Token(ChainId.MAINNET, '0x2ba592F78dB6436527729929AAf6c908497cB200', 18, 'CREAM', 'Cream')
export const BAC = new Token(ChainId.MAINNET, '0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a', 18, 'BAC', 'Basis Cash')
export const FXS = new Token(ChainId.MAINNET, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const ALPHA = new Token(ChainId.MAINNET, '0xa1faa113cbE53436Df28FF0aEe54275c13B40975', 18, 'ALPHA', 'AlphaToken')
export const USDP = new Token(
  ChainId.MAINNET,
  '0x1456688345527bE1f37E9e627DA0837D6f08C925',
  18,
  'USDP',
  'USDP Stablecoin'
)
export const DUCK = new Token(ChainId.MAINNET, '0x92E187a03B6CD19CB6AF293ba17F2745Fd2357D5', 18, 'DUCK', 'DUCK')
export const BAB = new Token(ChainId.MAINNET, '0xC36824905dfF2eAAEE7EcC09fCC63abc0af5Abc5', 18, 'BAB', 'BAB')
export const HBTC = new Token(ChainId.MAINNET, '0x0316EB71485b0Ab14103307bf65a021042c6d380', 18, 'HBTC', 'Huobi BTC')
export const FRAX = new Token(ChainId.MAINNET, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'FRAX')
export const IBETH = new Token(
  ChainId.MAINNET,
  '0xeEa3311250FE4c3268F8E684f7C87A82fF183Ec1',
  8,
  'ibETHv2',
  'Interest Bearing Ether v2'
)
export const PONT = new Token(
  ChainId.MAINNET,
  '0xcb46C550539ac3DB72dc7aF7c89B11c306C727c2',
  9,
  'pONT',
  'Poly Ontology Token'
)
export const PWING = new Token(
  ChainId.MAINNET,
  '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a',
  9,
  'pWING',
  'Poly Ontology Wing Token'
)

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]],
    [DUCK.address]: [USDP, WETH[ChainId.MAINNET]],
    [BAB.address]: [BAC, WETH[ChainId.MAINNET]],
    [HBTC.address]: [CREAM, WETH[ChainId.MAINNET]],
    [FRAX.address]: [FXS, WETH[ChainId.MAINNET]],
    [IBETH.address]: [ALPHA, WETH[ChainId.MAINNET]],
    [PONT.address]: [PWING, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
  [ChainId.OKCHAIN_TEST]: [...WRAPPED_NATIVE_ONLY[ChainId.OKCHAIN_TEST], OKCHAIN_TEST.USDT,OKCHAIN_TEST.ETHK,OKCHAIN_TEST.BTC],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, WBTC],
  [ChainId.FANTOM]: [...WRAPPED_NATIVE_ONLY[ChainId.FANTOM], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BSC]: [...WRAPPED_NATIVE_ONLY[ChainId.BSC], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
  [ChainId.OKCHAIN_TEST]: [...WRAPPED_NATIVE_ONLY[ChainId.OKCHAIN_TEST], OKCHAIN_TEST.USDT,OKCHAIN_TEST.ETHK,OKCHAIN_TEST.BTC],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [SUSHI[ChainId.MAINNET] as Token, WETH[ChainId.MAINNET]],
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ],
  [ChainId.ROPSTEN]: [
    [SUSHI[ChainId.ROPSTEN] as Token, WETH[ChainId.ROPSTEN]],
    [ROPSTEN_TOKENS.YUZU,ROPSTEN_TOKENS.ROSE],
    [ROPSTEN_TOKENS.USDT,ROPSTEN_TOKENS.ROSE],
    [ROPSTEN_TOKENS.USDT,ROPSTEN_TOKENS.YUZU],
    [ROPSTEN_TOKENS.USDT,ROPSTEN_TOKENS.BTC],
    [ROPSTEN_TOKENS.USDT,ROPSTEN_TOKENS.ETH],
  ],
  [ChainId.OKCHAIN_TEST]: [
    [SUSHI[ChainId.OKCHAIN_TEST] as Token, WETH[ChainId.OKCHAIN_TEST]],
    [OKCHAIN_TEST.USDT,OKCHAIN_TEST.ZOO],
    [OKCHAIN_TEST.USDT,OKCHAIN_TEST.ETHK],
    [OKCHAIN_TEST.USDT,OKCHAIN_TEST.BTC],
    [OKCHAIN_TEST.OKB,OKCHAIN_TEST.USDT],
  ],
  [ChainId.OASISETH_TEST]: [
    [SUSHI[ChainId.OASISETH_TEST] as Token, WETH[ChainId.OASISETH_TEST]],
    [OASISETH_TEST_TOKENS.YUZU,OASISETH_TEST_TOKENS.ETH],
    [OASISETH_TEST_TOKENS.USDT,OASISETH_TEST_TOKENS.ETH],
    [OASISETH_TEST_TOKENS.USDT,OASISETH_TEST_TOKENS.YUZU],
    [OASISETH_TEST_TOKENS.USDT,OASISETH_TEST_TOKENS.BTC],
    [OASISETH_TEST_TOKENS.USDT,WETH[ChainId.OASISETH_TEST]],
  ],
  [ChainId.OASISETH_MAIN]: [
    [SUSHI[ChainId.OASISETH_MAIN] as Token, WETH[ChainId.OASISETH_MAIN]],
    [OASISETH_MAIN_TOKENS.YUZU,OASISETH_MAIN_TOKENS.ETH],
    [OASISETH_MAIN_TOKENS.USDT,OASISETH_MAIN_TOKENS.ETH],
    [OASISETH_MAIN_TOKENS.USDT,OASISETH_MAIN_TOKENS.YUZU],
    [OASISETH_MAIN_TOKENS.USDT,WETH[ChainId.OASISETH_MAIN]],
  ],

}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png', 
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },  
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008'
]
//process.env.REACT_APP_DEFAULTCHAINID

export const DefaultChainId : ChainId = (<any>ChainId)[process.env.REACT_APP_DEFAULTCHAINID || 'OASISETH_SAPPHIRE']

export const APIHost = process.env.REACT_APP_APIHOST

export const UserRatioOfReward : number = 0.7

export const BLACKHOLE_ADDRESS : string = '0x00b9dCA177aa3DB6F344A455d9E0511a6Aa7ad8D';

export const blockNumPerS : number = 6;


export const FUND_PAIR: { readonly [chainId in ChainId]?: [Token, Token] } = {
  [ChainId.OASISETH_TEST]: [
    new Token(ChainId.OASISETH_TEST, '0x792296e2a15e6Ceb5f5039DecaE7A1f25b00B0B0', 18, 'wROSE', 'Wrapped ROSE'),
    new Token(ChainId.OASISETH_TEST, '0xC584fFD011e16A10fd8329853B9B8DE6E0313AD9', 18, 'USDT', 'USDT')
  ],
  [ChainId.OASISETH_MAIN]: [
    new Token(ChainId.OASISETH_MAIN, '0x21C718C22D52d0F3a789b752D4c2fD5908a8A733', 18, 'wROSE', 'Wrapped ROSE'),
    new Token(ChainId.OASISETH_MAIN, '0xdC19A122e268128B5eE20366299fc7b5b199C8e3', 6, 'USDT', 'USDT')
  ]
}

export const FUND_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: '0xa500784e2fb20278aa634feabcf1945c4ad2c6b7',
  [ChainId.OASISETH_MAIN] : '0x35849fF49510cfE2d964a7A08cff41cB07D32A30'
}

export const BurstPointContractAddress = '0xeB1Ee1A3536a7ddC37c14C59bB333f0E104e037a' 

export const CHAIN_CONFIG = {
  [ChainId.OASISETH_TEST]: {
    chainId: '0xa515',
    rpcUrl: RPC[ChainId.OASISETH_TEST],
    blockExplorerUrl: 'https://explorer.testnet.oasis.updev.si/',
  },
  [ChainId.OASISETH_MAIN]: {
    chainId: '0xa516',
    rpcUrl: RPC[ChainId.OASISETH_MAIN],
    blockExplorerUrl: 'https://explorer.emerald.oasis.dev/',
  },
  [ChainId.OASISETH_SAPPHIRE]: {
    chainId: '0x5aff',
    rpcUrl: RPC[ChainId.OASISETH_SAPPHIRE],
    blockExplorerUrl: 'https://testnet.explorer.sapphire.oasis.dev'
  }
}