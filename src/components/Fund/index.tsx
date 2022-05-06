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
import { FUND_ADDRESS , DefaultChainId} from '../../constants'
import Decimal from 'decimal.js'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'
import { Input as NumericalInput } from '../NumericalInput'
import { useFundRedeemCallback, useFundSubscribeCallback} from 'hooks/useFundCallback'
import { HistoryCard } from './HistoryCard'
import LeftTwo from 'components/EChart/lineChart'

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
            <div className="card">
                <div className="card-fund-token">
                    <div style={{ margin:'auto 0px' }}>
                        <CurrencyLogo currency={token} size='36px' style={{verticalAlign:"middle"}}/>
                        <CardText style={{verticalAlign:"middle"}}>&nbsp;&nbsp;{token.symbol}</CardText>
                    </div>
                    <CardUnit>
                        <CardText>123123</CardText>
                        <CardText1>APY</CardText1>
                    </CardUnit>
                    <CardUnit>
                        <CardText>{totalTokenForShow}&nbsp;{token.symbol}</CardText>
                        <CardText1>Total Deposit</CardText1>
                    </CardUnit>
                    <CardUnit>
                        <CardText>{perInStake}%</CardText>
                        <CardText1>Capital Utilization</CardText1>
                    </CardUnit>
                    <span className="card-button"
                        onClick={()=>{setMa(!ma)}}
                        style={{ margin:'auto 0px' }}
                        >
                        Manage
                        <StyledDropDown selected={ma}/>
                    </span>
                </div>
            </div>
            {
                ma?
                <div style={{display: 'flex', justifyContent:'space-between'}}>
                    <div style={{width:'48%'}}>
                        <div style={{display: 'flex', justifyContent:'flex-start', marginLeft:'20px'}}>
                            <CardTab selected={labelIndex == 0} onClick={()=>{setLabelIndex(0)}} >
                                Deposit
                            </CardTab>
                            <CardTab selected={labelIndex == 1} onClick={()=>{setLabelIndex(1)}} >
                                Withdraw
                            </CardTab>
                            <CardTab selected={labelIndex == 2} onClick={()=>{setLabelIndex(2)}} >
                                History
                            </CardTab>
                        </div>
                        {
                        labelIndex == 0?
                        <div className="card" >
                                <Row>
                                    <span>Input Amount</span>
                                    <span>Balance:&nbsp; {tokenBalance?.toSignificant(6)}&nbsp;{token.symbol} </span>
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
                                {
                                    inputCheck?
                                    <Row>
                                        <span>Get&nbsp;Funds</span>
                                        <span>{fixFloatFloor(parseFloat(input) * (1/fundTransRatio), 6)}</span>
                                    </Row>
                                    :
                                    null
                                }
                                {
                                    !account?
                                    <FailButton>Connect a Wallet</FailButton>
                                    :
                                    approval === ApprovalState.NOT_APPROVED || approval === ApprovalState.PENDING?
                                    <ApproveButton
                                        onClick={approveCallback}
                                    >Approve
                                    </ApproveButton>
                                    :
                                    inputCheck?
                                    <DepositButton
                                        onClick={()=>{
                                            subscribe()
                                            setInput('0.0')
                                        }}
                                        >Deposit</DepositButton>
                                    :
                                    <FailButton>Invalid Input</FailButton>
                                }
                        </div>
                        :
                        labelIndex == 1?
                        <div className="card" >
                                <Row>
                                    <span>Input Amount</span>
                                    <span>Balance:&nbsp;{fixFloatFloor(shareTokenBalance,6)}&nbsp;{token.symbol}Fund </span>
                                </Row>
                                <Row>
                                    <span> </span>
                                    <CardText2>-Corresponding to&nbsp;{fixFloatFloor(shareTokenBalance * fundTransRatio,6)}&nbsp;{token.symbol}</CardText2>
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
                        :<HistoryCard  token={token} tokenIndex={tokenIndex} />
                        }
                    </div>
                    <div style={{width:'48%', padding:'20px', minHeight:'400px'}}>
                        <LeftTwo index={tokenIndex}/>
                    </div>
                </div>
                :
                null
            }
        </>
    )
}