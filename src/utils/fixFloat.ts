import Decimal from "decimal.js";

export default function (handle: Number, fixto: number, intlen: number = 4): String {
    const temp =  handle.toFixed(fixto);
    const i = temp.indexOf(".");
    if( i <= intlen ){
        return temp
    }
    else{
        return handle.toFixed( fixto - (i - intlen) > 0 ? fixto - (i - intlen) : 0)
    }
}
  

export  function fixFloatFloor(handle: Number, fixto: number): String {
    var m = Math.pow(10 , fixto)
    var re = Math.floor( handle.valueOf() * m) / m
    return re.toFixed(fixto);
}


export function stringFix(handle: string, fixto: number): String{
    if(!handle) return "-";
    const num = new Decimal(handle)
    let zero = "0."
    let target = "<0."
    for(let i = 0; i< fixto - 1; i++){
        zero += '0'
        target += '0'
    }
    zero += '0'
    target += '1'
    return num.toFixed(fixto) == zero ? target : num.toFixed(fixto);
}

export function getTimeStr(time : number){
    var str = time.toFixed(0);
    if(str.length == 1){
        str = "0" + str
    }
    return str
}


export function transToThousandth(str : String){
    var re = str.split('.')
    var reg=/\d{1,3}(?=(\d{3})+$)/g;
    var temp = re[0].replace(reg, '$&,');
    if(re.length >= 2){
        return temp + "." + re[1]
    }
    else 
    {
        return temp
    }
}

export function showAddress(str: string){
    if(str.length < 10){
        return str
    }
    else{
        let re = ''
        re += str.slice(0,6)
        re += "..."
        re += str.slice(str.length-5)
        return re
    }
}

export function tokenAmountForshow(amount :any, decimal:number = 18) :number{
    //    console.log("decimal is ",decimal,"amount is ",amount.toString(10), "res is ",JSBI.toNumber( JSBI.divide( JSBI.multiply(amount,JSBI.BigInt(100)),JSBI.BigInt(Math.pow(10,decimal)))))
        return new Decimal(amount.toString()).div( new Decimal(Math.pow(10,decimal) )).toNumber()
        //return JSBI.toNumber( JSBI.divide( JSBI.multiply(amount,JSBI.BigInt(1e10)),JSBI.BigInt(Math.pow(10,decimal))))/1e10
}