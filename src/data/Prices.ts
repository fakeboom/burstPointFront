import { useState, useEffect } from "react";
import { APIHost } from "../constants";

export function  usePricesInfo() : any {
  const [PricesInfo,setPricesInfo] = useState({})
     //获取24小时交易和 抵押金额

  useEffect(()=>{
    const timer = setInterval(async ()=>{
        const {data} = await(await fetch(APIHost + "/prices")).json();
        setPricesInfo(data)

    },3000)
    return () =>{
        console.log("@@userPricesInfoHooks destroy")
      clearInterval(timer)
    }
  },[])

  return PricesInfo

}