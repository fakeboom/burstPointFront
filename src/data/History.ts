import { useState, useEffect, useMemo } from "react";
import { APIHost } from "../constants";
import { useActiveWeb3React } from '../hooks'
import Decimal from 'decimal.js'
import { stat } from "fs";
import { reverse } from "dns";

export function useFundHistory(index:number) : any{
    const [History , setHistory] = useState([])
    const { account , chainId } = useActiveWeb3React()
    let originAmountKey = index == 0 ? 'originToken0Amount' : 'originToken1Amount'
    let shareAmountKey = index == 0 ? 'shareToken0Amount' : 'shareToken1Amount'

    useEffect(()=>{
        const timer = setInterval(async ()=>{
            const {data} = await(await fetch(APIHost + "/yuzufund/userevents?from=" + account)).json();
            setHistory(data)
    
        },3000)
        return () =>{
            console.log("@@useFundHistoryHooks destroy")
          clearInterval(timer)
        }
      },[account])

    const [reList, inSum, outSum] = useMemo(
      ()=>{
        let reList :FundHistory[] = []
        let inSum = new Decimal(0)
        let outSum = new Decimal(0)
        History && History.forEach((element : any) => {
          if(element[originAmountKey] != '0'){
            let temp = new FundHistory(
              {
                event: element.event,
                originAmount : new Decimal(element[originAmountKey]),
                shareAmount : new Decimal(element[shareAmountKey]),
                timestamp: element.timestamp,
                hash : element.hash 
              }
            )
            reList.push(temp)
            if(temp.event == 'Redeemed'){
              outSum = outSum.add(temp.originAmount)
            }
            else{
              inSum = inSum.add(temp.originAmount)
            }
          }

        });
        return [reList, inSum, outSum]
      },
      [History]
    )

    return [reList, inSum, outSum]
}

export function useFundStatus(index : number) : [FundStatus[], string]{
  let netValueKey = index == 0 ? 'token0NetValue' : 'token1NetValue'
  let lossValueKey = index == 0 ? 'token0LossValue' : 'token1LossValue'
  let apyKey = index == 0 ? 'totalToken0NetApy' : 'totalToken1NetApy'
  const [status , setStatus] = useState([])
  const [apy , setApy] = useState<string>('0')
  useEffect(()=>{
    const timer = setInterval(async ()=>{
        const data = await(await fetch(APIHost + "/yuzufund/fundstatus")).json();
        const dataRev = (data.data as any[]).reverse()
        setStatus(dataRev as never[])
        setApy(data[apyKey])
        console.log(apyKey, data[apyKey], index )

    },3000)
    return () =>{
        console.log("@@useFundStatusHooks destroy")
      clearInterval(timer)
    }
  },[index])
  const reList = useMemo(
    ()=>{
      let reList : FundStatus[] = []
      status && status.forEach(
        (element : any)=>{
          let temp = new FundStatus(
            {
              timestamp: element.timestamp,
              tokenNetValue: parseFloat(element[netValueKey]),
              tokenLossValue: parseFloat(element[lossValueKey])
            }
          )
          reList.push(temp)
        }
      )
      return reList
    },
    [status]
  )
  return [reList, apy]
}

export function useGameId(): number{
  const [block , setBlock] = useState<string>('0')
  useEffect(()=>{
    const timer = setInterval(async ()=>{
        const data = await(await fetch(APIHost + "/getgamestatus")).json();
        console.log('data', data)
        setBlock(data.data)

    },3000)
    return () =>{
        console.log("@@useGameId destroy")
      clearInterval(timer)
    }
  },[])
  const re : number = useMemo(
    ()=>{
      let re = 0; 
      re = parseInt(block)
      return re
    },[block]
  )
  return re
}

export function useGameRecord(): GameRcord[]{
  const gameid = useGameId()
  const [records , setRecords] = useState([])
  useEffect(()=>{
    const timer = setInterval(async ()=>{
        const data = await(await fetch(APIHost + "/getbetinfo")).json();
        console.log('data', data)
        setRecords(data.data)

    },3000)
    return () =>{
        console.log("@@useGameRecord destroy")
      clearInterval(timer)
    }
  },[])
  const re : GameRcord[] = useMemo(
    ()=>{
      let re :GameRcord[]= []; 
      records && records.forEach(
        (element : any)=>{
          let earn = element.success == 1 ? new Decimal(element.amount).mul(new Decimal(parseInt(element.burstvalue)/ 100)) : new Decimal(0)
          let status = GameStatus.Fail
          if(element.gameid == gameid || element.endhash == ''){
            status = GameStatus.Pending
          }else if(element.success == 1){
            status = GameStatus.Success
          }
          let temp = new GameRcord(
            {
              id: element.gameid,
              playerAddress: element.address,
              betAmount: new Decimal(element.amount),
              finalGuess: parseInt(element.burstvalue)/ 100,
              earnAmount: earn,
              hash: element.endhash,
              status: status
            }
          )
          re.push(temp)
        }
      )

      return re
    },[records,gameid]
  )
  return re
}

export class FundHistory{
  public readonly event : String
  public readonly hash : String
  public readonly originAmount : Decimal
  public readonly shareAmount : Decimal
  public readonly timestamp : number
  constructor(data: Partial<FundHistory>){
    Object.assign(this, data);
  }
}

export class FundStatus{
  public readonly timestamp : number
  public readonly tokenNetValue: number
  public readonly tokenLossValue: number
  constructor(data: Partial<FundStatus>){
    Object.assign(this, data);
  }
}

export enum GameStatus{
  Pending,
  Fail,
  Success
}

export enum GameProcessStatus{
  Prepare,
  Bet,
  Going,
  End
}

export class GameRcord{
  public readonly id : number
  public readonly playerAddress: String
  public readonly betAmount: Decimal
  public readonly status: GameStatus
  public readonly finalGuess: number
  public readonly earnAmount: Decimal
  public readonly hash: String
  constructor(data: Partial<GameRcord>){
    Object.assign(this, data);
  }
}

export class GameProcessShow{
  public readonly blockNumber: number
  public readonly processStatus: GameProcessStatus
  public readonly addPerBlock: number
  constructor(data: Partial<GameProcessShow>){
    Object.assign(this, data);
  }
}