import echarts, { EChartOption } from 'echarts';
import React, { useCallback, useContext,useRef, useEffect, useMemo, useState } from 'react'
import Echart from './'
import { useFundStatus, FundStatus } from 'data/History'
import fixFloat, { fixFloatFloor, tokenAmountForshow, transToThousandth } from 'utils/fixFloat'

function LeftTwo({index}:{index : number}){
    const statusList = useFundStatus(index)
    const [xAxisData, data0, data1] = useMemo(
        ()=>{
            let xAxisData = []
            let data0 = []
            let data1 = []
            for(let i = 0; i < statusList.length; i++){
                let date = new Date(statusList[i].timestamp)
                xAxisData.push(
                    date.getFullYear()+'/'+
                    ((date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1))+'/'+
                    (date.getDay()<10 ? '0' + date.getDay() : date.getDay())
                )
                data0.push(parseFloat(fixFloat((statusList[i].tokenNetValue - 1)* 100,3) as string))
                data1.push(parseFloat(fixFloat((statusList[i].tokenLossValue - 1)* 100,3) as string))
            }
            return [xAxisData, data0, data1]
        },
        [statusList]
    )
    const option: EChartOption = {
        tooltip: {
            trigger: 'axis'
        },
        legend:{
            itemWidth: 100,
            inactiveColor: 'rgba(255, 255, 255, 0.5)',
            textStyle:{
                color: '#FFF',
            }
        },
        grid: {
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
                axisLabel: {
                    formatter: '{value}%'
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,0.6)'
                    }
                }
            },
        ],
        series: [
            {
                name: 'tokenNetValue',
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
                        borderWidth: '2'
                    }
                },
                areaStyle: {}
            },
            {
                name: 'tokenLossValue',
                type: 'line',
                data: data1,
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 1, 0, 0,
                            [{
                                offset: 0, color: 'rgba(97, 160, 168, 0)' // 0% 处的颜色
                            }, {
                                offset: 1, color: 'rgb(97, 160, 168,0.6)' // 100% 处的颜色
                            }]
                        ),
                        lineStyle: {
                            color: 'rgb(97, 160, 168,1)',
                            opacity: 0.8,
                            width: 2
                        },
                        borderColor: 'rgba(97, 160, 168,1)',
                        borderWidth: '2'
                    }
                },
                areaStyle: {}
            },
        ],
    };
    return (
        <Echart option={option} />
    )
}

export default LeftTwo