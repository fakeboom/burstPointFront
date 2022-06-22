import { Token , TokenAmount, JSBI } from '@liuxingfeiyu/zoo-sdk'
import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import CurrencyLogo from '../CurrencyLogo'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import { useApproveCallback,ApprovalState } from '../../hooks/useApproveCallback'
import { useActiveWeb3React } from '../../hooks'
import { useTokenContract , useFundContract} from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { FUND_ADDRESS , DefaultChainId, CHAIN_CONFIG} from '../../constants'
import Decimal from 'decimal.js'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'
import { Input as NumericalInput } from '../NumericalInput'
import { useFundRedeemCallback, useFundSubscribeCallback} from 'hooks/useFundCallback'
import { HistoryCard } from './HistoryCard'
import LeftTwo from 'components/EChart/lineChart'
import { useFundStatus, FundStatus } from 'data/History'

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

export function FundTokenCard({token}:{token : Token }){
    const [ ma, setMa] = useState<boolean>(false)
    const [ labelIndex, setLabelIndex ] = useState<number>(0)

    const { account , chainId } = useActiveWeb3React()
    const tokenBalance = useCurrencyBalance(account?? undefined, token)

    const [input, setInput] = useState<string>('0.0')

    const [shareInput, setShareInput] = useState<string>('0.0')
    
    const onMax = useCallback(
        ()=>{
            setInput(
                fixFloatFloor(parseFloat(tokenBalance?.toExact() ?? '0.0'), 6) as string    
                )
        }
        ,
        [tokenBalance]
    )

    const inputCheck = useMemo(
        ()=>{
            if( isNaN(parseFloat(input)) || parseFloat(input) == 0){
                return false
            }
            return parseFloat(input) > parseFloat(tokenBalance?.toExact() || '0') ? false : true
        },[input]
    )
    

    const inputToken  = useMemo(
        ()=>{
            const bigintAmount = new Decimal(parseFloat(input=='' ? '0' : input) * Math.pow( 10, token?.decimals ||18 )).toFixed(0)
            return new TokenAmount(token, bigintAmount)
        }
        ,[token, input]
    )

    const [approval, approveCallback] = useApproveCallback(inputToken||undefined, FUND_ADDRESS[chainId?? DefaultChainId])

    const subscribe = useFundSubscribeCallback(token.address, inputToken.raw)

    const fundContract = useFundContract()

    const token0 = useSingleCallResult(fundContract, "token0").result 

    const token1 = useSingleCallResult(fundContract, "token1").result

    const tokenInStake = useSingleCallResult(fundContract, "balanceInStake").result

    const staticsInfos = useSingleCallResult(fundContract, "staticsInfos").result

    tokenInStake && console.log("fundBalance", tokenAmountForshow(tokenInStake[0]), tokenAmountForshow(tokenInStake[1]))

    staticsInfos && console.log("staticsInfos", tokenAmountForshow(staticsInfos.currShareToken0Balance))


    const [shareTokenAddress, tokenIndex, tokenTotalKey, shareTotalKey] = useMemo(
        ()=>{
            let re = ''
            let indexRe = 0
            let handle = [token0, token1]
            for(let i = 0 ; i< handle.length; i++){
                let item = handle[i]
                if(item &&  item.shareToken && item.originToken){
                    if(item.originToken == token.address){
                        re = item.shareToken
                        indexRe = i
                        break
                    }
                }
            }
            let tokenTotalKey = 'originToken0Total'
            let shareTotalKey = 'currShareToken0Balance'
            if(indexRe == 1)
            {
                tokenTotalKey = 'originToken1Total'
                shareTotalKey = 'currShareToken1Balance'
            }
            
            return [re, indexRe, tokenTotalKey, shareTotalKey]
        }
        ,
        [token0, token1, staticsInfos]
    )

    const [_  , apy ] = useFundStatus(tokenIndex)

    const ApyShow = useMemo(
        ()=>{
            return fixFloat(parseFloat(apy) * 100, 3) + '%'
        },
        [tokenIndex, token0, token1, staticsInfos]
    )
        

    const shareTokenCon = useTokenContract( shareTokenAddress , false)
    const shareTokenBalance = tokenAmountForshow(useSingleCallResult(shareTokenCon, "balanceOf", [account??'']).result??'0', token.decimals)

    const fundTransRatio = useMemo(
        ()=>{
            let re = 0
            if(staticsInfos){
                let totalToken = tokenAmountForshow(staticsInfos[tokenTotalKey]??0, token.decimals)
                let totalShare = tokenAmountForshow(staticsInfos[shareTotalKey]??0, token.decimals)
                re = totalToken/totalShare
            }
            return re
        }
        ,
        [tokenIndex, staticsInfos]
    )


    const onShareMax = useCallback(
        ()=>{
            setShareInput(
                fixFloatFloor(shareTokenBalance, 6) as string    
                )
        }
        ,
        [shareTokenBalance]
    )

    const [totalTokenForShow, perInStake] = useMemo(
        ()=>{
            let totalTokenForShow = ''
            let perInStake = ''
            if(staticsInfos && tokenInStake){
                let someToken = tokenAmountForshow(tokenInStake[tokenIndex]??0, token.decimals)
                let totalToken = tokenAmountForshow(staticsInfos[tokenTotalKey]??0, token.decimals)
                console.log('testTokenStake', someToken, totalToken)
                perInStake = fixFloat(someToken / totalToken * 100, 2) as string
                totalTokenForShow = transToThousandth(fixFloat(totalToken, 3))
            }
            return [totalTokenForShow, perInStake]
        },
        [token, staticsInfos, tokenIndex, tokenInStake, tokenTotalKey]
    )

    const shareInputCheck = useMemo(
        ()=>{
            if( isNaN(parseFloat(shareInput)) || parseFloat(shareInput) == 0){
                return false
            }
            return parseFloat(shareInput) > shareTokenBalance ? false : true
        },[shareInput]
    )
    
    console.log("shareToken", shareTokenAddress)

    const shareInputBigInt  = useMemo(
        ()=>{
            return new Decimal(parseFloat(shareInput == '' ? '0' : shareInput) * Math.pow( 10, token.decimals )).toFixed(0)
        }
        ,[ shareInput]
    )

    const redeem = useFundRedeemCallback(shareTokenAddress, JSBI.BigInt(shareInputBigInt))
    
    return(
        <>
            <div style={{display: 'flex', flexDirection:'column'}}>
                <div style={{display: 'flex', justifyContent:'space-around'}}>
                    <div style={{width: '400px'}}>
                        <div className="card" >
                                <Row>
                                    <span>Bet Amount</span>
                                    <span>Balance: 0 ETH</span>
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
                                    <MaxButton
                                        style={{margin:'auto 0px'}}
                                        onClick={onShareMax}
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
                                    shareInputCheck?
                                    <Row>
                                        <span>Get&nbsp;{token.symbol}</span>
                                        <span>{fixFloatFloor(parseFloat(shareInput) * fundTransRatio, 6)}</span>
                                    </Row>
                                    :
                                    null
                                }
                                {
                                    !account?
                                    <FailButton>Connect a Wallet</FailButton>
                                    :
                                    shareInputCheck?
                                    <DepositButton
                                        onClick={()=>{
                                            redeem()
                                            setShareInput('0.0')
                                        }}
                                        >WithDraw</DepositButton>
                                    :
                                    <FailButton>Invalid Input</FailButton>
                                }
                        </div>
                    </div>
                    <div style={{padding:'20px', minHeight:'300px'}}>
                        <LeftTwo index={tokenIndex}/>
                    </div>
                </div>
                <HistoryCard/>
            </div>
        </>
    )
}