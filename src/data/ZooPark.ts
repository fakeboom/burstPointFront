import { BigNumber } from '@ethersproject/bignumber'
import {ChainId, CurrencyAmount, JSBI, Token, TokenAmount ,StakePool, AttenuationReward, ZOO_PARK_ADDRESS,ZOO_PARK_EXT_ADDRESS} from '@liuxingfeiyu/zoo-sdk'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from '../hooks/index'
import {APIHost, DefaultChainId,AllDefaultChainTokens, ZOO_USDT_SWAP_PAIR_ADDRESS} from "../constants/index"
import { usePairContract, useTokenContract } from '../hooks/useContract'
import ERC20_INTERFACE from '../constants/abis/erc20'
import { Interface } from '@ethersproject/abi'
import { abi as TokenWrapper_ABI} from '@liuxingfeiyu/zoo-core/deployments/oasistest/TokenWrapper.json'
import { useEffect, useMemo, useState } from 'react'
import { useBlockNumber } from '../state/application/hooks'


export function useZooUsdtSwapPrice() :number {
  const contract = usePairContract(ZOO_USDT_SWAP_PAIR_ADDRESS[DefaultChainId])
  const result = useSingleCallResult(contract,"getReserves").result
  const yuzuToken = (<any>AllDefaultChainTokens)[DefaultChainId].YUZU
  const usdtToken = (<any>AllDefaultChainTokens)[DefaultChainId].USDT
  if(result&& result.reserve0 && result.reserve1){
    if(usdtToken.address.toLocaleLowerCase() < yuzuToken.address.toLocaleLowerCase() ){
      return result.reserve0 /result.reserve1 * Math.pow( 10,yuzuToken.decimals-usdtToken.decimals ) ?? 1
    }else{
      return result.reserve1 /result.reserve0 * Math.pow( 10,yuzuToken.decimals-usdtToken.decimals ) ?? 1
    }

  }else{
    return 1
  }

}