import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import logo from './logo.svg';
import './App.css';
import Web3 from './components/Web'
import './assets/o.css';
import { useActiveWeb3React } from './hooks'
import { DefaultChainId , FUND_PAIR} from './constants'
import { FundTokenCard , StrategyCard} from './components/Fund'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { useTokenContract , useFundContract} from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'
import styled from 'styled-components'
import Logo from 'assets/images/monoLogo.jpg'


const CardUnit = styled.div`
    display: flex;
    flex-direction: column;
    height: 60px;
    justify-content: space-between;
`

const CardText = styled.span`
    font-size: 20px;
`

const CardText1 = styled.span`
    font-size: 18px;
    color: rgba(255, 255, 255, 0.6);
`

function App() {
  const { account , chainId} = useActiveWeb3React()
  const fundPair = FUND_PAIR[chainId ?? DefaultChainId]
  const prices:any  =  useSelector<AppState>(state=>state.zoo.tokenPrices)

  const fundContract = useFundContract()

  const token0 = useSingleCallResult(fundContract, "token0").result 

  const token1 = useSingleCallResult(fundContract, "token1").result

  const staticsInfos = useSingleCallResult(fundContract, "staticsInfos").result

  const totalLock = useMemo(
    ()=>{
      if( !token0 || !token1 || !staticsInfos || !fundPair )
      {
        return '0'
      }
      let arr = [0, 1]
      if(token0.originToken != fundPair[0].address){
        arr = [1, 0]
      }
      const originToken0 = fundPair[arr[0]]
      const originToken1 = fundPair[arr[1]]
      let token0sum = tokenAmountForshow(staticsInfos.originToken0Total ??0, originToken0.decimals) * prices[originToken0.symbol??'']
      let token1sum = tokenAmountForshow(staticsInfos.originToken1Total ??0, originToken1.decimals) * prices[originToken1.symbol??'']
      console.log('testprices', token0sum, token1sum)
      return transToThousandth(fixFloat(token0sum + token1sum,3))

    }
    ,[token0, token1, staticsInfos, prices]
  )
  

  return (
    <div className="App">
      <header className="App-header">
        <div>BurstPoint</div>
        <Web3/>
      </header>
      {fundPair&&<FundTokenCard token={fundPair[0]} />}
    </div>
  );
}

export default App;
