import { Token , TokenAmount, JSBI ,Currency, CurrencyAmount} from '@liuxingfeiyu/zoo-sdk'
import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useCurrencyBalance , useETHBalances} from '../../state/wallet/hooks'
import { useApproveCallback,ApprovalState } from '../../hooks/useApproveCallback'
import { useActiveWeb3React } from '../../hooks'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { FUND_ADDRESS , DefaultChainId, CHAIN_CONFIG} from '../../constants'
import Decimal from 'decimal.js'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'
import { Input as NumericalInput } from '../NumericalInput'
import { useBetCallback, useEscapeCallback} from 'hooks/useFundCallback'
import { HistoryCard } from './HistoryCard'
import LeftTwo from 'components/EChart/lineChart'
import { useFundStatus, FundStatus} from 'data/History'
import { useGameId} from 'data/History'
import {useBlockNumber } from 'state/application/hooks'
import Web3 from 'web3';

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

const CardText2 = styled.span`
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
`

const CardTab = styled.div<{ selected:boolean }>`
    padding: 10px 0px;
    width: 160px;
    color: rgba(255, 255, 255, 0.6);
    background: ${({selected})=>(selected ? '#999999': '#666666')};
    :hover{
        opacity: ${({selected})=>(selected ? '1' : '0.7')};
    }
`

const MaxButton = styled.span`
    font-weight: bold;
    cursor: pointer;
    :hover{
        opacity: 0.7;
    }
`

const CardButton = styled.div`
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    min-width: 120px;
    width: fit-content;
    padding: 20px 10px;
    margin: 0px auto;
    :hover{
        opacity: 0.7;
    }
`

const ApproveButton = styled(CardButton)`
    background: #336699;
`

const FailButton = styled(CardButton)`
    background: #666666;
    :hover{
        opacity: 1;
    }
`

const DepositButton = styled(CardButton)`
    background: #6aa84f;
`

const EscapeButton = styled(CardButton)`
    background: #FFD300;
`

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 10px;
`
const InputRow = styled(Row)`
    background: #666666;
    color: rgba(255, 255, 255, 0.6);
    border-radius: 6px;
    margin: 30px 0px 20px;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
    margin: 0 0.25rem 0 0.5rem;
    height: 35%;

    transform: ${({ selected })=>( selected ? 'rotate(180deg)' : '')};

    path {
        stroke: #FFF;
        stroke-width: 1.5px;
    }
`

export function StrategyCard(){
    const { account , chainId } = useActiveWeb3React()
    return(
        <div className="card" style={{padding:'20px 30px'}}>
            <CardText style={{width : '100%', textAlign:'left', display:'inline-block'}}>
                Strategy:
            </CardText>
            <CardText style={{width : '100%', textAlign:'left', display:'inline-block'}}>        
            The Impermanet Loss Immune Strategy helps single token holders pair up to mine in Dex, 
            while minimize the impermanet loss by avoiding possible trade on-chain, and automaticlly rebalance and compound.
            </CardText>
            <CardText style={{width : '100%', textAlign:'right', display:'inline-block'}} className="app-link">
                <a style={{position:'relative'}} target='_blank' href={(CHAIN_CONFIG as any)[chainId ?? DefaultChainId].blockExplorerUrl + 'address/' +FUND_ADDRESS[chainId ?? DefaultChainId] + '/transactions'} >
                    Contract
                </a> 
            </CardText>
        </div>
    )
}

export function FundTokenCard({}:{ }){
    enum BetStatus{
        TimeToBet,
        CanEscape,
        WaitNext
    }
    const { account , chainId } = useActiveWeb3React()
    const nowBlock = useBlockNumber()
    const gameid = useGameId()
    //const tokenBalance = useETHBalances([account?? undefined])

    const [tokenBalance, setTokenBalance] = useState<CurrencyAmount>(CurrencyAmount.ether('0'))
    useEffect(
        ()=>{
            const web3 = new Web3(window.ethereum as any)
            if(account){
                web3.eth.getBalance(account as string).then(
                    (result)=>{
                        let nativeToken = Currency.getNativeCurrency(DefaultChainId)
                        setTokenBalance(
                            new CurrencyAmount(nativeToken, JSBI.BigInt(result.toString()))
                        )
                    }
                )
            }
            
        },
        [account, nowBlock]
    )


    const gameStatus = useMemo(
        ()=>{
            if(!nowBlock){
                return BetStatus.WaitNext
            }
            if(nowBlock - gameid >= 110 ||  nowBlock - gameid <0){
                return BetStatus.WaitNext
            }else if(nowBlock - gameid < 10){
                return BetStatus.TimeToBet
            }else{
                return BetStatus.CanEscape
            }
        },[nowBlock , gameid]
    )



    const userBalance = useMemo(
        ()=>{
            if(tokenBalance && account){
                return tokenBalance
            }
            let nativeToken = Currency.getNativeCurrency(DefaultChainId)
            return new CurrencyAmount(nativeToken, '0')
        }
        ,[tokenBalance]
    )

    const [input, setInput] = useState<string>('0.0')

    const [shareInput, setShareInput] = useState<string>('0.0')
    
    const onMax = useCallback(
        ()=>{
            setInput(
                fixFloatFloor(parseFloat(userBalance?.toExact() ?? '0.0'), 6) as string    
                )
        }
        ,
        [userBalance]
    )

    const inputCheck = useMemo(
        ()=>{
            if( isNaN(parseFloat(input)) || parseFloat(input) == 0){
                return false
            }
            if(!userBalance)
            {
                return false
            }
            return parseFloat(input) > parseFloat(userBalance?.toExact() || '0') ? false : true
        },[input]
    )
    

    const inputToken  = useMemo(
        ()=>{
            let nativeToken = Currency.getNativeCurrency(DefaultChainId)
            const bigintAmount = new Decimal(parseFloat(input=='' ? '0' : input) * Math.pow( 10, nativeToken?.decimals ||18 )).toFixed(0)
            return new CurrencyAmount(nativeToken, bigintAmount)
        }
        ,[input]
    )

    const [approval, approveCallback] = useApproveCallback(inputToken||undefined, FUND_ADDRESS[chainId?? DefaultChainId])

    console.log('approval',approval)

    const bet = useBetCallback(gameid, parseFloat(shareInput) * 100 , inputToken.raw)

    const escape = useEscapeCallback(gameid)

    return(
        <>
            <div style={{display: 'flex', flexDirection:'column'}}>
                <div style={{display: 'flex', justifyContent:'space-around'}}>
                    <div style={{width: '400px'}}>
                        <div className="card" >
                                <Row>
                                    <span>Bet Amount</span>
                                    <span>Balance: {userBalance && userBalance?.toSignificant(6)} ROSE</span>
                                </Row>
                                <InputRow>
                                    <NumericalInput
                                        style={{fontSize:'20px', color:'rgba(255, 255, 255, 0.6)'}}
                                        value={input}
                                        onUserInput={val => {
                                            setInput(val)
                                        }
                                        }
                                    />
                                    <MaxButton
                                        style={{margin:'auto 0px'}}
                                        onClick={onMax}
                                    >Max</MaxButton>
                                </InputRow>
                                <Row>
                                    <span>BurstPoint </span>
                                    <span></span>
                                </Row>
                                <InputRow>
                                    <NumericalInput
                                        style={{fontSize:'20px', color:'rgba(255, 255, 255, 0.6)'}}
                                        value={shareInput}
                                        onUserInput={val => {
                                            setShareInput(val)
                                        }
                                        }
                                    />
                                </InputRow>
                                {
                                    !account?
                                    <FailButton>Connect a Wallet</FailButton>
                                    :
                                    gameStatus == BetStatus.TimeToBet?
                                    (
                                        inputCheck?
                                        <DepositButton
                                            onClick={()=>{
                                                bet()
                                                setShareInput('0.0')
                                            }}
                                        >Bet</DepositButton>
                                        :
                                        <FailButton>Invalid Input</FailButton>
                                    )
                                    :
                                    gameStatus == BetStatus.CanEscape?
                                    <EscapeButton
                                            onClick={()=>{
                                                escape()
                                            }}
                                        >Escape</EscapeButton>
                                    :
                                    <FailButton>Wait Next Game</FailButton>
                                    
                                }
                        </div>
                    </div>
                    <div style={{padding:'20px', minHeight:'300px'}}>
                        <LeftTwo/>
                    </div>
                </div>
                <HistoryCard/>
            </div>
        </>
    )
}