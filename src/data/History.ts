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