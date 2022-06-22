import echarts, { EChartOption } from 'echarts';
import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import Echart from './'
import { useFundStatus, FundStatus } from 'data/History'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'

function LeftTwo({index}:{index : number}){

    const startBlockNum = 100
    const nowBlockNum = 400
    const rate = 0.001
    const [xAxisData, data0] = useMemo(
        ()=>{
            let xAxisData = []
            let data0 = []
            for(let i = startBlockNum; i< nowBlockNum; i++){
                xAxisData.push( i - startBlockNum)
                let rand = Math.floor(Math.random() * 100)
                data0.push( 1 + i* rate + rand * 0.00001 )
            }
            return [xAxisData, data0]
        },
        []
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
            <div style={{color: color, position:'absolute', left: '35%', top:' 20', fontSize:'100px', zIndex:'100'}}>{data0[data0.length - 1].toFixed(2)}X</div>
            <Echart option={option} />
        </div>
    )
}

export default LeftTwo