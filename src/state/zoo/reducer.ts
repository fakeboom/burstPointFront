import { StakePool } from '@liuxingfeiyu/zoo-sdk'
import { createAction } from '@reduxjs/toolkit'
import { createReducer } from '@reduxjs/toolkit'

export interface ZooState {
    price: number,
    tokenPrices: {},
   stakePools :StakePool[],
}

export const initialState: ZooState = {
   price: 1,
   tokenPrices: {},
   stakePools :[],
}

export const updateZooPrice = createAction<{ newPrice: number }>('zoo/updateZooPrice')
export const updateZooTokenPrices = createAction<{ tokenPrices: number }>('zoo/updateZooTokenPrices')
export const updateZooStatePools = createAction<{ stakePools: StakePool[] }>('zoo/updateZooStatePools')

export default createReducer(initialState, builder =>
    builder
      .addCase(updateZooPrice,(state,{payload:{newPrice}}) => {
          state.price = newPrice
      })
      .addCase(updateZooTokenPrices,(state,{payload:{tokenPrices}}) => {
          state.tokenPrices = tokenPrices
      })
      .addCase(updateZooStatePools,(state,{payload:{stakePools}}) => {
          state.stakePools = stakePools
      })
)