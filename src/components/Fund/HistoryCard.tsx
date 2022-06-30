import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useActiveWeb3React } from '../../hooks'
import { useTokenContract } from 'hooks/useContract'
import { useSingleCallResult } from 'state/multicall/hooks'
import { FUND_ADDRESS , DefaultChainId, CHAIN_CONFIG} from '../../constants'
import Decimal from 'decimal.js'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth , showAddress} from 'utils/fixFloat'
import { useFundHistory, FundHistory, GameRcord, GameStatus , useGameRecord} from 'data/History'
import { Token , TokenAmount, JSBI } from '@liuxingfeiyu/zoo-sdk'
import JumpImg from '../../assets/images/web-link.png'
import { isWindows } from 'react-device-detect'

export function HistoryCard({}:{ }){

    //const [history, inSum, outSum] = useFundHistory(tokenIndex)

    const history: GameRcord[] = useGameRecord()
    console.log('history', history)
    /*[
        new GameRcord(
            {
                id: 100,
                playerAddress: "0x123123",
                betAmount: new Decimal(123.12),
                status: GameStatus.Pending,
                finalGuess: 1.2,
                earnAmount: new Decimal(123.12),
                hash: ""
            }),
        new GameRcord(
            {
                id: 100,
                playerAddress: "0x123123",
                betAmount: new Decimal(123.12),
                status: GameStatus.Fail,
                finalGuess: 1.2,
                earnAmount: new Decimal(123.12),
                hash: ""
            }),  
        new GameRcord(
            {
                id: 100,
                playerAddress: "0x123123",
                betAmount: new Decimal(123.12),
                status: GameStatus.Success,
                finalGuess: 1.2,
                earnAmount: new Decimal(123.12),
                hash: ""
            }) 
    ]*/

    const color : { [ gameStatus in GameStatus]: string } = {
        [GameStatus.Pending] : "#ECBA0A",
        [GameStatus.Success] : "#38EC0A",
        [GameStatus.Fail] : "#EC300A"
    }

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


    const myList = useMemo(
        ()=>{
            let myList : GameRcord[] = []
            for(let i = 0; i< history.length; i++){
                if(history[i].playerAddress == account){
                    myList.push(history[i])
                }
            } 
            return myList
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
                setList(myList)
            }
        }
        ,[num, myList, history]
    )

    return (
        <div className="card" style={{margin: '30px'}}>
            <Row style={{justifyContent:'flex-start',borderBottom:'1px solid rgba(255, 255, 255, 0.6)'}}>
                <CardTab selected={num == 0} onClick={
                    ()=>{
                        setList(history)
                        setNum(0)
                    }
                }>All</CardTab>
                <CardTab selected={num == 1} onClick={
                    ()=>{
                        setList(myList)
                        setNum(1)
                    }
                }>Mine</CardTab>
            </Row>
            <Row style={{borderBottom:'1px solid rgba(255, 255, 255, 0.6)'}}>
                        <CardText1 style={{minWidth:'100px'}}>id</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>burstPoint</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>betAmount</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>earnAmount</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>player</CardText1>
                        <CardText1 style={{flex:'1', textAlign:'right'}}>
                            hash
                        </CardText1>
                    </Row>
            <div style = {{maxHeight : '300px', overflow:'scroll'}}>
            {
                list.map(
                    (item : GameRcord)=>{
                    return(
                    <Row style={{borderBottom:'1px solid rgba(255, 255, 255, 0.6)'}}>
                        <CardText1 style={{minWidth:'100px'}}>{item.id}</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>{item.finalGuess}</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>{fixFloat(tokenAmountForshow(item.betAmount, 18),3)}&nbsp;ROSE</CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right', color: color[item.status]}}>
                            {
                                item.status == GameStatus.Pending ?
                                "Pending"
                                :
                                item.status == GameStatus.Success?
                                fixFloat(tokenAmountForshow(item.earnAmount, 18),3) + ' ROSE'
                                :
                                '-'                           
                            }
                            </CardText1>
                        <CardText1 style={{flex:'2', textAlign:'right'}}>{showAddress(item.playerAddress as string)}</CardText1>
                        <span style={{flex:'1', textAlign:'right'}}>
                            {
                                item.hash != ''?
                                <ClickImg 
                                onClick={
                                    ()=>{
                                        window.open((CHAIN_CONFIG as any)[chainId ?? DefaultChainId].blockExplorerUrl + '/tx/' + item.hash)
                                    }
                                }
                                src={JumpImg} height={'25px'}/>
                                :
                                null
                            }                          
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