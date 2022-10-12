import { Contract } from '@ethersproject/contracts'
import { ChainId, WETH, Token } from '@liuxingfeiyu/zoo-sdk'
import  TokenWrapper_ABI  from '@liuxingfeiyu/zoo-core/deployments/oasistest/TokenWrapper.json'
import  IUniswapV2PairABI  from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import  BURST_ABI from '../constants/abis/BurstPoint.json'
import { BurstPointContractAddress, FUND_ADDRESS } from '../constants'
import { useMemo } from 'react'
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20'
import ERC20_ABI from '../constants/abis/erc20.json'
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator'
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall'
import { V1_EXCHANGE_ABI, V1_FACTORY_ABI, V1_FACTORY_ADDRESSES } from '../constants/v1'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import Web3 from 'web3';
import * as sapphire from '@oasisprotocol/sapphire-paratime';


// returns null on errors
export default function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useV1FactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && V1_FACTORY_ADDRESSES[chainId], V1_FACTORY_ABI, false)
}

export function useV2MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true)
}

export function useV1ExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V1_EXCHANGE_ABI, withSignerIfPossible)
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI.abi , withSignerIfPossible)
}

export function useTokenWrapper(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, TokenWrapper_ABI.abi , withSignerIfPossible)
}

export function useBurstContract() {
  const web3 = new Web3(window.ethereum as any)
  web3.setProvider(sapphire.wrap(web3.currentProvider as any) as any);
  const contract = new web3.eth.Contract(BURST_ABI.abi as any, BurstPointContractAddress);
  return contract
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React()
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false)
}

