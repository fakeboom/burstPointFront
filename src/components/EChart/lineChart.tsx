import echarts, { EChartOption } from 'echarts';
import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import Echart from './'
import { useFundStatus, FundStatus, useGameId} from 'data/History'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'
import {useBlockNumber } from 'state/application/hooks'

function LeftTwo({}:{}){

    const nowBlockNum = useBlockNumber()
    const rate = 0.1
    const startBlockNum = useGameId()
    const [xAxisData, data0, timeToBet] = useMemo(
        ()=>{
            let xAxisData = []
            let data0 = []
            let timeToBet = false
            if( startBlockNum == 0 || !nowBlockNum || nowBlockNum - startBlockNum > 100){
                return [[], []]
            }
            if( nowBlockNum >=  startBlockNum && nowBlockNum - startBlockNum <= 10){
                timeToBet = true
            }
            for(let i = startBlockNum + 10; i< nowBlockNum; i++){
                xAxisData.push( i )
                let rand = Math.floor(Math.random() * 100)
                data0.push( 1 + (i - startBlockNum - 10) * rate + rand * 0.00001 )
            }
            return [xAxisData, data0, timeToBet]
        },
        [nowBlockNum, startBlockNum]
    )

    const color = "#EB7D0D"
    const option: EChartOption = {
        tooltip: {
            trigger: 'none'
        },
        grid: {
            show: false,
            left: '1%',
            right: '5%',
            top: '8%',
            bottom: '4%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData,
            axisLabel: {
                rotate: 60,
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,0.6)'
                }
            }
        },
        yAxis: [
            {
                type: 'value',
                scale: true,
                axisLabel: {
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.6)'
                    }
                },
                splitLine:{
                    show : false
                }
            },
        ],
        series: [
            {
                name: 'net profit',
                type: 'line',
                data: data0,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [{
                                offset: 0, color: 'rgba(145, 199, 174, 0)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgb(145, 199, 174,0.6)' // 100% 处的颜色
                            }]
                        ),
                        lineStyle: {
                            color: 'rgb(145, 199, 174,1)',
                            opacity: 0.8,
                            width: 2
                        },
                        borderColor: 'rgba(145, 199, 174,1)',
                        borderWidth: '0'
                    }
                },
                areaStyle: {}
            },
        ],
    };
    return (
        <div style={{ position:'relative', width:' 800px', height: '360px'}}>
            <div style={{color: color, position:'absolute', width:'800px', top:' 20', fontSize:'100px', zIndex:'100'}}>
                {data0.length >= 1 ? 
                    data0[data0.length - 1].toFixed(2) + 'X'
                    :
                    timeToBet?
                    'Time To Bet'
                    :
                    'Waiting'}
            </div>
            <Echart option={option} />
        </div>
    )
}

export default LeftTwo