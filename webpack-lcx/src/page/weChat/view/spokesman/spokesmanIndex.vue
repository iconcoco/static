<template>
    <div class="banner spokesman-container">
        <div class="banner-ad">

        </div>
        <router-view class="container"></router-view>
    </div>
</template>

<script>

    import './../../../../css/weChat/spokesman.scss';

    import {wxcongfig} from './../../uitls/api.js';

    export default{
        data(){
            return{}
        },
        created() {
            wxcongfig().then(res=>{
                // console.log(res);
                setWxconfig(res);
            });

            let setWxconfig = function(data){
                     wx.config({
                        debug: false,
                        appId: data.appId, 
                        timestamp: data.timestamp, 
                        nonceStr:  data.noncestr, 
                        signature: data.signature,
                        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'] // 分享好友
                    });

                    wx.ready(function(){
         
                        wx.onMenuShareTimeline({
                            imgUrl : 'https://user.carespay.com/H5/img/dyrlst.png',
                            link : 'https://user.carespay.com/weChat.html#/wechatShare',
                            desc : 'CaresPAY代言人计划了解一下',
                            title : 'CaresPAY代言人计划',
                            success : function () {  
                                // 分享成功可以做相应的数据处理
                            },
                            cancel: function () { 
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        
                        wx.onMenuShareAppMessage({
                            imgUrl : 'https://user.carespay.com/H5/img/dyrlst.png',
                            link : 'https://user.carespay.com/weChat.html#/wechatShare',
                            desc : 'CaresPAY代言人计划了解一下',
                            title : 'CaresPAY代言人计划',
                            success : function () {  
                                // 分享成功可以做相应的数据处理
                            },
                            cancel: function () { 
                                
                            }
                        });
                    });
            }

            
        },
    }
</script>