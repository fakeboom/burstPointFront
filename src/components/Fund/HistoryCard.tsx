import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useTokenContract , useFundContract} from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { FUND_ADDRESS , DefaultChainId, CHAIN_CONFIG} from '../../constants'
import Decimal from 'decimal.js'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'
import { useFundHistory, FundHistory } from 'data/History'
import { Token , TokenAmount, JSBI } from '@liuxingfeiyu/zoo-sdk'
import JumpImg from '../../assets/images/web-link.png'
import { isWindows } from 'react-device-detect'

export function HistoryCard({tokenIndex, token}:{ tokenIndex:number, token : Token }){

    const [history, inSum, outSum] = useFundHistory(tokenIndex)

    const inSumShow = transToThousandth(fixFloat(tokenAmountForshow(inSum, token.decimals),3))

    const outSumShow = transToThousandth(fixFloat(tokenAmountForshow(outSum, token.decimals),3))

    const { account, chainId } = useActiveWeb3React()

    const Row = styled.div`
        display: flex;
        justify-content: space-between;
        padding: 10px;
    `
    const Column = styled.div`
        display: flex;
        flex-direction: column;
    
    `

    const CardText = styled.span`
    font-size: 20px;
`

    const CardText1 = styled.span`
        font-size: 18px;
        color: rgba(255, 255, 255, 0.6);
    `

    const ClickImg = styled.img`
        cursor: pointer;
        :hover{
            opacity: 0.7;
        }
    `

    const CardTab = styled.span<{ selected:boolean }>`
        font-size: 18px;
        margin:0 10px;
        cursor: pointer;
        color: ${({selected})=>(selected ? '#FFF': 'rgba(255, 255, 255, 0.6)')};
        :hover{
            opacity: ${({selected})=>(selected ? '1' : '0.7')};
        }
    `


    const [BuyList, RedeemList] = useMemo(
        ()=>{
            let BuyList : FundHistory[] = []
            let RedeemList : FundHistory[] = []
            for(let i = 0; i< history.length; i++){
                if(history[i].event == 'Redeemed'){
                    RedeemList.push(history[i])
                }
                else{
                    BuyList.push(history[i])
                }
            } 
            return [BuyList, RedeemList]
        },
        [history]
    )
    const [num, setNum] = useState<number>(0)


    const [list, setList] = useState<any[]>(history)


    useEffect(
        ()=>{
            if(num == 0){
                setList(history)
            }
            if(num == 1){
                setList(BuyList)
            }
            if(num == 2){
                setList(RedeemList)
            }
        }
        ,[history]
    )

    return (
        <div className="card" style={{}}>
            <Row> 
                <Column>
                    <CardText>{inSumShow}&nbsp;{token.symbol}</CardText>
                    <CardText1>Total Invest</CardText1>
                </Column>
                <Column>
                    <CardText>{outSumShow}&nbsp;{token.symbol}</CardText>
                    <CardText1>Total Redeem</CardText1>
                </Column>
            </Row>
            <Row style={{justifyContent:'flex-start',borderBottom:'1px solid rgba(255, 255, 255, 0.6)'}}>
                <CardTab selected={num == 0} onClick={
                    ()=>{
                        setList(history)
                        setNum(0)
                    }
                }>All</CardTab>
                <CardTab selected={num == 1} onClick={
                    ()=>{
                        setList(BuyList)
                        setNum(1)
                    }
                }>Buy</CardTab>
                <CardTab selected={num == 2} onClick={
                    ()=>{
                        setList(RedeemList)
                        setNum(2)
                    }
                }>Redeem</CardTab>
            </Row>
            <div style = {{maxHeight : '300px', overflow:'scroll'}}>
            {
                list.map(
                    (item : FundHistory)=>{
                    const data = new Date(item.timestamp)
                    return(
                    <Row style={{borderBottom:'1px solid rgba(255, 255, 255, 0.6)'}}>
                        <CardText1 style={{minWidth:'100px'}}>{item.event}</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>{fixFloat(tokenAmountForshow(item.originAmount, token.decimals),3)}&nbsp;{token.symbol}</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>{data.getFullYear()+'/'+
                            ((data.getMonth()+1 < 10 ? '0'+(data.getMonth()+1) : data.getMonth()+1))+'/'+
                            (data.getDay()<10 ? '0' + data.getDay() : data.getDay())}</CardText1>
                        <span style={{flex:'1', textAlign:'right'}}>
                            <ClickImg 
                                onClick={
                                    ()=>{
                                        window.open((CHAIN_CONFIG as any)[chainId ?? DefaultChainId].blockExplorerUrl + '/tx/' + item.hash)
                                    }
                                }
                                src={JumpImg} height={'25px'}/>
                        </span>
                    </Row>
                    )
                    }
                )
            }
            </div>
        </div>
    )
}