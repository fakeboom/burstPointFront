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
import { useTokenContract } from 'hooks/useContract'
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
  const prices:any  =  useSelector<AppState>(state=>state.zoo.tokenPrices)
  return (
    <div className="App">
      <header className="App-header">
        <div>BurstPoint</div>
        <Web3/>
      </header>
      <FundTokenCard/>
    </div>
  );
}

export default App;
