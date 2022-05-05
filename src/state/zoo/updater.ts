import { usePricesInfo } from "../../data/Prices"
import { useZooUsdtSwapPrice } from "../../data/ZooPark"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, AppState } from "../../state"
import { updateZooPrice, updateZooTokenPrices } from "./reducer"

export default function Updater(): null {
  
  
    console.log("Zooupdatar rerender")
    const lastPrice:number = useZooUsdtSwapPrice()

    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=>{
        dispatch(updateZooPrice({newPrice:lastPrice}))

    },[lastPrice])

    const tokenPrices = usePricesInfo()

    useEffect(()=>{
        //replace 
        if(tokenPrices["ETH"]){
            tokenPrices["ETHK"] = tokenPrices["ETH"]
        }
        dispatch(updateZooTokenPrices({tokenPrices:tokenPrices}))
    },[tokenPrices])



    return null
}