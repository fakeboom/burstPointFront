import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, CurrencyAmount, JSBI, Token, TokenAmount, StakePool, AttenuationReward, ROUTER_ADDRESS, ZOO_ZAP_ADDRESS, Pair, WETH } from '@liuxingfeiyu/zoo-sdk'
import { useMultipleContractSingleData, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks'
import { useActiveWeb3React } from './index'
import { APIHost, DefaultChainId, AllDefaultChainTokens, ZOO_USDT_SWAP_PAIR_ADDRESS } from "../constants/index"
import { usePairContract, useTokenContract , useBurstContract} from 'hooks/useContract'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import ERC20_INTERFACE from 'constants/abis/erc20'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { TransactionResponse } from '@ethersproject/providers'
import { useTransactionAdder } from 'state/transactions/hooks'
import { PayableOverrides }  from '@ethersproject/contracts'



export function useBetCallback(
  gameid : number,
  burstValue: number,
  amount : JSBI,
){
  const tokenContract = useBurstContract()
  const addTransaction = useTransactionAdder()
  const { account, chainId }  = useActiveWeb3React()

  const bet = useCallback(async (): Promise<void> => {
    
    if (!tokenContract) {
      console.error('BetContract is null')
      return
    }
    return tokenContract
      .methods.bet( gameid ,Math.floor(burstValue)).
      send({
        value : BigNumber.from(amount.toString()),
        gasLimit: 3000000,
        from: account as string,
      }
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'BurstPoint Bet'}
          )
      }).catch((error: Error) => {
        console.debug('Failed to Bet', error)
        throw error
      })
  }, [amount, gameid, burstValue, tokenContract, addTransaction, account])

  return bet
}

export function useEscapeCallback(
  gameid : number
){
  const tokenContract = useBurstContract()
  const addTransaction = useTransactionAdder()
  const { account, chainId }  = useActiveWeb3React()

  const escape = useCallback(async (): Promise<void> => {
    
    if (!tokenContract) {
      console.error('BetContract is null')
      return
    }
    return tokenContract
      .methods.escape( gameid).send({
        from: account as string,
        gasLimit: 3000000
      }
      )
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'BurstPoint Escape'}
          )
      }).catch((error: Error) => {
        console.debug('Failed to Escape', error)
        throw error
      })
  }, [gameid, tokenContract, addTransaction, account])

  return escape
}
