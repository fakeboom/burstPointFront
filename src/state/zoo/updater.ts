import { usePricesInfo } from "../../data/Prices"
import { useZooUsdtSwapPrice } from "../../data/ZooPark"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, AppState } from "../../state"
import { updateZooPrice, updateZooTokenPrices } from "./reducer"

export default function Updater(): null {
  
  
    console.log("Zooupdatar rerender")


    return null
}