/**
 * 该文件主要是请求 **需要缓存** 的数据的接口，其他数据不需要缓存可不必放在该文件中
 * Author:LCX
 * 641616451@qq
 * 2018/8/5
 */


import  store  from './store.js';
import { Message } from 'element-ui';
import { 
    customerInfo,                   //请求用户信息
    queryCity,                      //请求城市接口
    personInfo,                     //获取实名认证信息
    queryPlatformInfo,              //平台类型列表
    queryAllStroe,                  //所有店铺列表
    queryProvince,                  //获取省份列表
    queryCurrency,                  //获取币种列表
    queryBank,                      //获取银行列表
    querySalesVolume,               //获取销售年销量
    queryProductCategory,           //获取销售类目列表
    queryAccountDetail,             //获取提现银行卡的详情信息
    storeInfo,                      //获取提现店铺列表
    queryAccountList,               //获取银行卡列表
 } from '../../../js/api';


 //1. 获取用户信息并储存
 export const queryCustomerInfo = async ()=>{
     let data = store.state.base.customerInfo;
     if(data){
         return data;
     }else{

        let res = await customerInfo()
        if(res.code==0){
            store.commit('setBaseDate',{
                key:'customerInfo',
                data:res.data
            });
            return res.data;
        }else{
            Message.error(res.msg)
        }
     }
}

 //2. 获取城市并返回
 export const queryCityData =async (n)=>{

    let cityDataArr = store.state.cityData[n];
    if(cityDataArr){
        //有缓存
        return cityDataArr;
    }else{
        //没有缓存
        let res = await queryCity({code:n});
        if(res.code==0){
            store.commit('cityDataCache',{
                key:n,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
        
    };
 }

 //3. 获取实名认证信息
 export const queryPersonInfo = async ()=>{

    let data = store.state.base.personInfo;
    if(data){
        //有缓存
        return data;
    }else{
        //没有缓存
        let res = await personInfo();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`personInfo`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
        
    };
 }

 //4. 获取平台类型
 export const queryPlatformType = async ()=>{

    let data = store.state.base.platType;

    if(data){//是否有缓存
        return data;
    }else{
        let res = await queryPlatformInfo();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`platType`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
 }

 //5. 获取所有店铺列表
 export const queryStoreList = async ()=>{

    let data = store.state.base.storeList;
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await queryAllStroe();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`storeList`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
    
 }

 //6. 获取省份列表
 export const queryProvinceList = async ()=>{

    let data = store.state.base.province;
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await queryProvince();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`province`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
    
 }

 //7. 获取币种列表
 export const queryCurrencyList = async ()=>{

    let data = store.state.base.currency;
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await queryCurrency();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`currency`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
 }

 //8. 获取银行列表
 export const queryBankList = async ()=>{

    let data = store.state.base.bank;
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await queryBank();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`bank`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
 }

 //9. 获取预计年销量列表
 export const querySaleVolumeList = async ()=>{

    let data = store.state.base.salesVolume;
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await querySalesVolume();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`salesVolume`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
 }

 //10. 获取销售类目列表
 export const querySaleTypeList = async ()=>{

    let data = store.state.base.category;
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await queryProductCategory();
        if(res.code==0){
            store.commit('setBaseDate',{
                key:`category`,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
 }

 //11. 获取销售类目列表
 export const queryBankInfoDetail = async (id)=>{

    let data = store.state.BankCark[id];
    if(data){   //有缓存
        return data;
    }else{      //没有缓存
        let res = await queryAccountDetail({id});
        if(res.code==0){
            store.commit('bankInfoDataCache',{
                key:id,
                data:res.data
            });
            return res.data
        }else{
            Message.error(res.msg);
        }
    }
 }

 //12. 提现店铺列表请求

 export const queryCashModleData = async (id)=>{

    // let data = store.state.CASHMODLE;
    // if(data){   //有缓存
    //     return data;
    // }else{      //没有缓存
        let res = await storeInfo();
        if(res.code==0){
            // store.commit('saveModleData',{
            //     key:'CASHMODLE',
            //     data:res.data
            // });
            return res.data
        }else{
            Message.error(res.msg);
        }
    // }
 }

 //13. 提现账户列表请求

 export const queryAccountModleData = async (id)=>{

    // let data = store.state.WITHDRAWMODLE;
    // if(data){   //有缓存
    //     return data;
    // }else{      //没有缓存
        let res = await queryAccountList();
        if(res.code==0){
            // store.commit('saveModleData',{
            //     key:'WITHDRAWMODLE',
            //     data:res.data
            // });
            return res.data
        }else{
            Message.error(res.msg);
        }
    // }
 }

 //国家对应code
 export const NationCode = [
    { 
        nation:'美国',
        code:'US',
        platformCode:'BM',
    },
    { 
        nation:'加拿大',
        code:'CA',
        platformCode:'BM',
    },
    { 
        nation:'墨西哥',
        code:'MX',
        platformCode:'BM',
    },
    // 欧洲站
    { 
        nation:'德国',
        code:'DE',
        platformCode:'EU',
    },
    { 
        nation:'西班牙',
        code:'ES',
        platformCode:'EU',
    },
    { 
        nation:'法国',
        code:'FR',
        platformCode:'EU',
    },
    { 
        nation:'英国',
        code:'GB',
        platformCode:'EU',
    },
    { 
        nation:'意大利',
        code:'IT',
        platformCode:'EU',
    },
    // 印度
    { 
        nation:'印度',
        code:'IN',
        platformCode:'YD',
    },
 ]

