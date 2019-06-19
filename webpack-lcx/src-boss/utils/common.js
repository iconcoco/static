/**
 * 将一串数字变成千位数计数的方法
 * @param {*} paramas 数字
 * Author: Lcx
 * 641616451@
 */
export const Pricemoney = paramas => { 
    if(/\./.test(paramas)){
        //有小数
        let p = paramas.toString()
        let INT = p.split('.')[0],
            Float = p.split('.')[1];
        return (`${INT.toString().replace(/[0-9]+?(?=(?:([0-9]{3}))+$)/g, function(a) { return a + ',' })}.${Float}`) 
    }else{
        //整数
        return (paramas.toString().replace(/[0-9]+?(?=(?:([0-9]{3}))+$)/g, function(a) { return a + ',' })) 
    }
    
}

/**
 * 判断元素是否有一个类
 * @param {*} node dom节点
 * @param {*} className 类名
 */
export const hasClass = (node,className)=>{

    if(node.classList){
      return  node.classList.contains(className)
    }else{
        return node.className.indexOf(className)>-1
    }
   
}

/**
 * 给元素添加一个类名
 * @param {*} node 
 * @param {*} cls 
 */
export const addClass = (node,cls)=>{
    if(!hasClass(node,cls)) {node.className += ` ${cls}` };
}

/**
 * 元素移除一个类
 * @param {*} node 
 * @param {*} cls 
 */
export const removeClass = (node,cls)=>{
    if(hasClass(node,cls)){
        let reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        node.className = node.className.replace(reg, " ");
    }
}
/**
 * 将手机号、银行卡号中间一段隐藏变成星号
 * @param {*} paramas 
 */
export const hideNumberCode = (paramas)=> {
    if(paramas.length<=11){ 
        //手机号码
        return `${paramas.substr(0,3)} **** ${paramas.substr(paramas.length-4)}`;
    }else{
        //银行卡号
        return `${paramas.substr(0,4)} **** ${paramas.substr(paramas.length-4)}`;
    }
}

/**
 * 获取链接中的参数
 * @param {*} name 
 */
export const getUrlQueryParams = (name) => {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.href.split('?')[1].match(reg);
    
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

/**
 * 获取时间戳
 * @param {*} params 
 */
export const getTimer = params => {
    return new Date(params).getTime()
}

export const formatTimer=(params,bol)=>{
    if(!params) return;
    let y = new Date(params).getFullYear(),
        m = new Date(params).getMonth()+1,
        d = new Date(params).getDate(),
        h = new Date(params).getHours(),
        mm = new Date(params).getMinutes(),
        s = new Date(params).getSeconds();
    if(bol){
        return `${y}-${m<10?'0'+m:m}-${d<10?'0'+d:d}`;
    }else{
        return `${y}-${m<10?'0'+m:m}-${d<10?'0'+d:d} ${h<10?'0'+h:h}:${mm<10?'0'+mm:mm}:${s<10?'0'+s:s}`;
    }
}

/**
 * 数组去重
 * @param {*} params 数组
 */
export const ArrayFilter = params => {
    let arr = [params[0]];
    params.forEach(i=>{
        if(arr.indexOf(i)<0) arr.push(i);
    });

    return arr;
}

/**
 * 将后台返回的code变成数据回显
 * @param {*} array  数据的显示数组
 * @param {*} pName  数组回显的字段名
 * @param {*} pCode  数组回显的字段code
 * @param {*} code   进行比较的code
 */
export const dataReshow = (array,pName,pCode,code)=>{
    let re = array.filter(item=>{
        return item[pCode] == code
    });
    if(re.length){
        return re[0][pName]
    }else{
        return code
    }
    
}

/**
 * 操作cookie的方法
 */
export const cookie = {
    //设置cookie方法
    set:function(key,val,time){
        let date=new Date(); //获取当前时间
        let expiresDays=time;  //将date设置为n天以后的时间
        date.setTime(date.getTime()+expiresDays*24*3600*1000); //格式化为cookie识别的时间
        document.cookie=key + "=" + val +";expires="+date.toGMTString();  //设置cookie
    },
    //获取cookie方法
    get:function(key){
        let getCookie = document.cookie.replace(/[ ]/g,"");  //获取cookie，并且将获得的cookie格式化，去掉空格字符
        let arrCookie = getCookie.split(";")  //将获得的cookie以"分号"为标识 将cookie保存到arrCookie的数组中
        let tips;  //声明变量tips
        for(let i=0;i<arrCookie.length;i++){  
            let arr=arrCookie[i].split("=");  
            if(key==arr[0]){  
                tips=arr[1];   
                break;   
            }
        }
        return tips;
    },
    delete:function(key){ //删除cookie方法
        let date = new Date(); //获取当前时间
        date.setTime(date.getTime()-10000); //将date设置为过去的时间
        document.cookie = key + "=v; expires =" +date.toGMTString();//设置cookie
    }
}

/**
 * 转成百分数
 * @param {*} num  需要转化的数字
 * @param {*} toFixed 保留多少位小数 默认两位
 */
export const toPercent = (num,toFixed)=>{
    if(num == undefined) return;

  return  `${Number((num)*100).toFixed(toFixed||2)}%`;
}

/**
 * 筛选可以合并表格的数据--纵向
 * @param {*} data 原始数据
 * @param {*} key 主键
 * 返回过滤后的数据
 */
export const fiterTableRow = function(data,key){
    if(data.length<2) return data;
    let Rarr = [];
    data.map((item)=>{
         //1. 是否已经有数据 
        if(Rarr.length){
           //2. 当前数据与上一条数据是否可以归类
           let Mid = Rarr[Rarr.length-1];
            if(Mid[key] == item[key]){ 
                Mid[`columnIndex`] ? Mid[`columnIndex`]+=1 : Mid[`columnIndex`] = 2;
            }else{
                Rarr.push(item)
            }

        }else{

            Rarr.push(item);
        }
    });

    data.map(item=>{
        Rarr.map(inner=>{

            if(item[key]==inner[key]) item[`columnIndex`] = inner[`columnIndex`];

        });
    });

    return data;
}

/**
 * 基于elment-ui的合并单元格的回调函数
 * @param {*} rArr //需要合并的纵列
 * @param {*} columnIndex 
 * @param {*} rowIndex 
 * @param {*} row 
 * @param {*} data //需要比较原始的数据
 * @param {*} name //主键
 * 返回可以合并的纵列的行数
 */
export const rowspanFn = (rArr,columnIndex,rowIndex,row,data,name)=>{
    if (rArr.includes(columnIndex)) { //第一列
        if(rowIndex>0){

            if(data[rowIndex-1][name]==row[name]){
                return {
                    rowspan:0,
                    colspan:0
                }   
            }else{
                return{
                    rowspan: row.columnIndex || 1,
                    colspan: 1
                }
            }

        }else{
            return{
                rowspan: row.columnIndex,
                colspan: 1
            }
        }
    }
}