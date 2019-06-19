<template>
    <div class="main-container" :class="{miniContainer:isMin}">
        <div class="system-main-sidebar">
            <h1 class="system-logo">
                <span class="max"></span>
                <span @click="bindChangeMainContainer" class="min"></span>
            </h1>
            <nav>
                <!-- 菜单列表 -->
                <ul class="max admin-main-menu">
                    <li v-for="(item,index) in MainNav" :key="index">
                        <p>
                            <i class="fa" :class="item.icon"></i>
                            {{item.alias}} 
                            <span class="el-icon-arrow-down"></span> 
                        </p>
                        <ul class="inner-menu">
                            <li v-for="(innerItem,innerIndex) in item.children" @click="bindNavRoter(innerItem.name,true)" :class="{active: innerItem.name == currentName}" :key="innerIndex">{{innerItem.alias}}</li>
                        </ul>
                    </li>
                </ul>

                <!-- 小菜单 -->
                <ul class="min min-bar">
                    <li v-for="(item,index) in MainNav" :key="index" >
                        <i :title="item.alias" class="fa" :class="item.icon"></i>
                        <ul>
                            <li v-for="(innerItem,innerIndex) in item.children" @click="bindNavRoter(innerItem.name,true)" :class="{active: innerItem.name == currentName}" :key="innerIndex">{{innerItem.alias}}</li>
                        </ul>
                    </li>
                </ul>

            </nav>
        </div>
        <!-- 顶部 -->
        <div class="system-main-view">
            <header class="system-main-header">
                
                <div class="fl tab-menu clearfix">
                    <span @click="bindChangeMainContainer"  class="menu-controler" :class="{active:isMin}">
                        <i class="fa fa-list"></i>
                    </span>
                    <ul class="clearfix" @contextmenu="tabContainerContext" id="tab-container">
                        <li class="tab-first" :class="{active: 'index' == currentName }">
                            <router-link to="/admin/index">首页</router-link>
                        </li>
                        <li 
                        v-for="(item,index) in this.$store.state.TabList" 
                        :key="index"
                        :class="{active:item.name == currentName}"
                         >
                            <!-- <router-link :to="item.path">{{item.alias}}</router-link> -->
                            <a  @click="bindNavRoter(item.name)" href="javascript:;">{{item.alias}}</a>
                            <i  @click="bindCloseTabSelect(item.name)" class="el-icon-close"></i>
                        </li>
                    </ul>
                </div>

                <div :style="`top:${closeAll.y}px;left:${closeAll.x}px;`" class="tabClossAll">
                    <p @click="bindCloseAllTab">关闭所有</p>
                </div>

                <!-- 右侧个人信息 -->
               <ul class="fr person-menu" :class="{active:isShowMsgbox}">
                   <!-- @click="bindOpenMsgBox" -->
                   <li >
                       <i class="el-icon-bell"></i>
                   </li>
                   <li>{{loginInfo.roleName}}</li>
                   <li class="userName">
                       <span>{{loginInfo.userName}}</span>
                        <div class="inner-menu">
                            <p  @click="bindNavRoter('Personal')">个人中心</p>
                            <p @click="bindLogout">退出登录</p>
                        </div>
                   </li>
               </ul>
            </header>
            <!-- 路由视图 -->
            <div id="loading" class="system-main-content">
                <router-view></router-view>
            </div>
            <!-- 消息盒子 -->
            <div class="system-main-msgbox" :class="{active:isShowMsgbox}">
                消息列表hihihh
            </div>
        </div>

    </div>
</template>

<script>

    import $ from 'jquery';

    import { cookie } from '../../utils/common.js';
    import { 
        logout,
        queryAuth,
     } from '../../utils/axios/api.js';

     import { adminOtherTab } from '../../utils/router/router.js';


    let admin = {
        init:function(){
            this.event.menuSlider();
        },
        event:{
            menuSlider:function(){
                $('.admin-main-menu').on('click','li p',function(){
                    let par = $(this).parent('li'),
                        innerMenu = par.find('.inner-menu');
                    if(par.hasClass('active')){
                        par.removeClass('active') ;
                        innerMenu.slideUp(300);
                    }else{
                        par.addClass('active') ;
                        innerMenu.slideDown(300);

                        par.siblings('li').removeClass('active').find('.inner-menu').slideUp(300);
                    }
                });
            },
            
        }
    }

    export default{
        data(){
            return{
                isMin:false,
                MainNav:[
                    // {
                    //     alias:'合规模块',
                    //     children:[
                    //         {
                    //             alias:'kyc列表',
                    //             name:'kycList' 
                    //         }
                    //     ],  
                    // }
                ],         //左边的菜单
                isA:false,
                loginInfo:{
                    userName:'',
                },
                isShowMsgbox:false,
                closeAll:{
                    x:0,
                    y:0
                },
                timer:null
            }
        },
        created() {
            sessionStorage.clear();
            this.$store.commit("clearState");

            let info = cookie.get('adminUserInfo');
            // let info = sessionStorage.getItem('adminUserInfo');
            
            //判断是否已经有登陆的信息
            if(info){
                this.loginInfo = JSON.parse(info);
                this.$store.commit('setBaseData',{
                    key:'USERINFO',
                    data:JSON.parse(info)
                });
                //请求权限目录
                queryAuth().then(res=>{
                    if(res.code==0){
                        let auth = [];  //权限目录的数据结构
                        //1.遍历获取目录数据
                        res.data.childList.forEach(item=>{
                            let o = {
                                alias:'',
                                icon:'',
                                children:[],
                            };
                            //1.1 模块的名称
                            o.alias = item.authDesc;    
                            o.icon = item.icon;    
                            item.childList.forEach(innerItem=>{
                                let d = {
                                    alias:innerItem.authDesc,
                                    name:innerItem.authName,
                                };
                                //1.2 模块子页面数据
                                o.children.push(d)
                                //1.3 保存目录权限
                                this.$store.state.Authority.push(d.name);
                                //1.4 保存tab切换的菜单
                                this.$store.commit('setTabData',d)
                            });
                            //添加
                            auth.push(o);
                        });
                        //2.设置目录
                        this.MainNav = auth;

                    }else{
                        this.$message.error(res.msg);
                    }
                });
                //2018-11-30  详情页打开tab
                adminOtherTab.map(item=>{
                    item.children.map(innerItem=>{
                         let d = {
                             alias:innerItem.alias,
                             name:innerItem.name,
                        };
                        //1.3 保存目录权限
                        this.$store.state.Authority.push(d.name);
                        //1.4 保存tab切换的菜单
                        this.$store.commit('setTabData',d)
                    });
                });
                 
            }else{
                //没有信息，相当于没有登陆，需要跳转到首页重新登录
                this.$router.push({name:'login'})
            }

        }, 
        mounted(){
            admin.init();
        },
        methods:{
            //退出登录
            bindLogout(){
                logout().then(res=>{
                    if(res.code==0){
                        sessionStorage.clear();
                        cookie.delete('adminUserInfo');
                        //清空当前打开的菜单
                        
                        this.$store.commit("clearState");
                        this.$router.push({name:'login'});
                    }else{
                        this.$message.error(res.msg)
                    }
                });
            },
            //展开消息盒子
            bindOpenMsgBox(){

                this.isShowMsgbox = !this.isShowMsgbox;
            },
            //大小菜单收缩
            bindChangeMainContainer(){
                this.isMin = !this.isMin;
            },
            //左侧菜单的tab跳转
            bindNavRoter(name,reflesh){
            // let c = this.$children;
            // console.log(c[c.length-1]);
            // console.log(c[c.length-1].loadingQuery);
            // console.log(c[c.length-1].$createElement);
            
               reflesh ? (
                    this.$router.push({
                        name:"Reflesh",
                        params:{ name }
                    })
               ) :
                this.$router.push({name});
            },
            //右上tab的关闭按钮
            bindCloseTabSelect(name){   
                let tabArr = this.$store.state.TabList;
                
                tabArr.forEach((item,index)=>{
                    if(item.name == name){
                        //1. 删除tabList中的对应数据
                        tabArr.splice(index,1);
                        //2. 判断当前关闭的是当前的视图吗？
                        if(this.currentName == name){
                            //2.1 同时激活当前要显示的组件
                            index>0 ?
                            (this.$router.push({name:`${tabArr[index-1].name}`})):
                            (location.hash = `/admin/index`)
                        }
                        
                        //3. 删除对应的组件数据状态保存
                        this.$store.commit('setModelRecordData',{
                            key:name,
                            data:null
                        });

                        return;
                    }
                });
               
            },
            //关闭所有的tab
            bindCloseAllTab(){
                let tabArr = this.$store.state.TabList;
                if(!tabArr.length) return;
                //2.
                location.hash = `/admin/index`
                //3. 删除对应的组件数据状态保存
                tabArr.forEach(item=>{
                    this.$store.commit('setModelRecordData',{
                        key:item.name,
                        data:null
                    });
                }); 
                //4. 清空数据
                this.$store.state.TabList = [];

                $('.tabClossAll').hide();
            },
            tabContainerContext(e){

                let ev = e || event;
                ev.preventDefault();

                this.closeAll.x = ev.clientX;
                this.closeAll.y = ev.clientY;
                //展示
                $('.tabClossAll').show();

                clearTimeout(this.timer);
                this.timer = setTimeout(()=>{
                    $('.tabClossAll').hide();
                },3000);

            },
        },
        computed:{
            currentName(){
                return this.$store.state.TabCurrentName;
            }
        },
        watch:{
            
        }
    }
</script>

<style lang="scss" scoped>

    @import './../../css/element-variables.scss';

    $menu:#495060;
    $menu_active:#363d4d;

    $menu_bg:#fff;

    .main-container{
        height:100%;
        overflow-x: hidden;
         .max{
            display: block;
        }
        .min{
            display: none;
        }
    }
    //左边菜单收起来的时候
    .miniContainer{
        overflow-x: auto;
        .max{
            display: none;
        }
        .min{
            display: block;
        }
        .system-main-sidebar{
            width: 50px;
            .system-logo{
                .min{
                    display: inline-block;
                }
                .max{
                    display: none;
                }
            }
        }
        .system-main-view{
             margin-left: 50px;
        }
    }
    //左侧下拉菜单
    .system-main-sidebar{
        position: fixed;
        left: 0;
        top: 0;
        width: 200px;
        height: 100%;
        background-color: $menu_bg;
        // background: $menu_bg url('./../../image/login/loginBg.png') no-repeat left center fixed;
        // background-size: 1920px 980px;
        z-index: 3000;
        transition: width .5s;
        
        // overflow-x: hidden;
        .system-logo{
            text-align: center;
            height: 50px;
            padding-top: 10px;
            background-color: $menu_bg;
            //   background-color: $menu;
            margin-bottom: 20px;
            //   box-shadow:0 1px 0px 0px  #e0dede;
            .max{
                display: inline-block;
                width: 179px;
                height: 31px;
                // background: url('../../image/logo.png') no-repeat center center;
                background: url('../../image/logo.jpg') no-repeat center center;
                background-size: 179px 31px;
            }
            .min{
                display: none;
                width: 50px;
                height: 31px;
                overflow: hidden;
                background: url('../../image/logo.png') no-repeat left center;
                background-size: 179px 31px;
            }
        }
        .min-bar{
            color: #aaa;
            text-align: center;
            li{
                height: 44px;
                line-height: 44px;
                position: relative;
                >ul{
                    position: absolute;
                    top: 0;
                    left: 100%;
                    width: 150px;
                    z-index: 555;
                    text-align: left;
                    background-color: $menu_bg;
                    display: none;
                      box-shadow:0 1px 4px 0px  #e0dede;
                    li{
                        height: 36px;
                        line-height: 36px;
                        padding-left: 10px;
                        cursor: pointer;
                        &:hover{
                            color: #333;
                        }
                        &.active{
                            color: $--color-primary;
                            background-color: $--color-primary-hover;
                            &::after{
                                content: "";
                                position: absolute;
                                width: 2px;
                                height: 100%;
                                top: 0;
                                left: 0;
                                background-color: $--color-primary;
                            }
                        }
                    }
                }
            }
            li:hover{
                i{
                    color: $--color-primary;
                }
                >ul{
                    display: block;
                }
            }
        }

           //左侧菜单
        .admin-main-menu{
            >li{
                >p{
                    height: 44px;
                    line-height: 44px;
                    color: #666;
                    padding-left: 15px;
                    cursor: pointer;
                    white-space:nowrap;
                    position: relative;
                    i{
                        margin-right: 5px;
                    }
                    span{
                        position: absolute;
                        top: 17px;
                        right: 20px;
                        transition: all .3s;
                    }
                }
                &.active{
                    >p{
                        color: $--color-primary;
                        font-weight: 700;
                        // background-color: $--color-primary-hover;
                        // &::after{
                        //     content: "";
                        //     position: absolute;
                        //     width: 2px;
                        //     height: 100%;
                        //     top: 0;
                        //     left: 0;
                        //     background-color: $--color-primary;
                        // }
                        span{
                            transform: rotate(180deg);
                        }
                    }
                }
            }
            //内侧菜单
            .inner-menu{
                display: none;
                background-color: $menu_bg;
                li{
                    height: 36px;
                    line-height: 36px;
                    padding-left: 40px;
                    color: #aaa;
                    cursor: pointer;
                    position: relative;
                     white-space:nowrap;
                    &:hover{
                        color: #333;
                    }
                    &.active{
                        color: $--color-primary;
                        // font-weight: bold;
                        background-color: $--color-primary-hover;
                        &::after{
                            content: "";
                            position: absolute;
                            width: 2px;
                            height: 100%;
                            top: 0;
                            left: 0;
                            background-color: $--color-primary;
                        }
                    }
                }
            }
        }

    }
    //右侧主要视图
    .system-main-view{
        position: relative;
        margin-left: 200px;
        height: 100%;
        transition: all .5s;
        .system-main-header{
            position: absolute;
            top: 0;
            right: 0;
            width: 100%;
            height: 50px;
            line-height: 50px;
            z-index: 2999;
            // background-color: #3c8dbc;
            // background: #fff url('./../../image/login/loginBg.png') no-repeat left center fixed;
            background-color: #fff;
            transition: all .5s;
            box-shadow:0 1px 4px 0px  #e0dede;
            //展开收起按钮
            .menu-controler{
                display: inline-block;
                width: 26px;
                height: 32px;
                color: #aaa;
                font-size: 24px;
                line-height: 32px;
                // background:$--color-primary url('../../image/shou.png') no-repeat center;
                // background-size: 100%;
                cursor: pointer;
                vertical-align: middle;
                margin-left: -36px;
                // position: absolute;
                // left: 23px;
                // top: 14px;
                &:hover{
                    color: $--color-primary;
                }
                &.active{
                    //  background:$--color-primary url('../../image/zhan.png') no-repeat center;
                    //  background-size: 100%;
                }
            }
            //
            .tab-menu{
                width: 100%;
                height: 50px;
                padding-left: 56px;
                padding-right: 190px;
                position: relative;
                // overflow-y: hidden;
                >ul{
                    display:block;
                    height: 54px;
                    // overflow-y: hidden;
                    // position: absolute;
                    // top: 0;
                    margin-top: -50px;
                    white-space: nowrap;
                    overflow-x: hidden;
                    &:hover{
                        overflow-x: auto;
                    }
                    li{
                        display: inline-block;
                        margin-right: 10px;
                        padding-right: 10px;
                        height: 30px;
                        line-height: 30px;
                        border-radius: 15px;
                        color: #333;
                        background-color: #fff;
                        
                        cursor: pointer;
                        a{
                            display: inline-block;
                            padding-left: 10px;
                            height: 100%;
                            color: #333;
                        }
                       
                        &:hover{
                            color: #fff;
                            background-color: $--color-primary;
                            a{
                                 color: #fff;
                            }
                        }
                         &.active{
                           
                            background-color: $--color-primary;
                            color: #fff;
                            //  border-bottom:2px solid $--color-primary;
                            a{
                                color: #fff;
                            }
                         }
                    }
                    //首页
                    .tab-first{
                        margin-right: 5px;
                        &:hover,
                        &.active{
                            border-bottom: none;
                        }
                    }
                   
                }
            }
            .tabClossAll{
                position: fixed;
                // top: 0;
                // right: 20%;
                width: 85px;
                background-color: #fff;
                z-index: 100;
                box-shadow: 0 1px 4px 0px #e0dede;
                display: none;
                p{
                    line-height: 24px;
                    font-size: 12px;
                    text-align: center;
                    color: #666;
                    cursor: pointer;
                }
            }
            //个人菜单
            .person-menu{
                position: absolute;
                top: 0;
                right: 0;
                z-index: 2;
                width: 190px;
                >li{
                    float: left;
                    color: #333;
                    font-size: 14px;
                    margin: 0 12px;
                    position: relative;
                    cursor: pointer;
                    &:hover{
                        .inner-menu{
                            display: block;
                        }
                    }
                }
                .userName{
                    max-width: 65px;
                    margin: 0px;
                    padding-left:17px;
                    text-align: left;
                    white-space: nowrap;
                    // overflow-x: hidden;
                    text-overflow: ellipsis;
                }
                .inner-menu{
                    display: none;
                    position: absolute;
                    top: 50px;
                    left: 0px;
                    width: 80px;
                    background-color: #fff;
                    box-shadow: 0 1px 4px 0px #e0dede;
                    p{
                        height: 35px;
                        line-height: 35px;
                        font-size: 12px;
                        text-align: center;
                        cursor: pointer;
                        color: #666;
                        &:hover{
                            background-color: #f8f8f9;
                            color: $--color-primary;
                        }
                    }
                }
                &.active{
                    // background-color: $menu;
                    //  background: $menu_active url('./../../image/login/loginBg.png') no-repeat left center fixed;
                    // background-size: 1920px 980px;
                    // >li{
                    //     color: #fff;
                    // }
                }            
            }
        }
        .system-main-content{
            height: 100%;
            padding-top: 50px;
            background-color: #f4f5f9;
            overflow-y: auto;

            >div{
                padding:10px;
            }
        }
        //消息列表容器
        .system-main-msgbox{
            position: fixed;
            top: 0;
            right: 0;
            width: 0px;
            height: 100%;
            padding-top: 50px;
            background-color: $menu_bg;
            // background: $menu_active url('./../../image/login/loginBg.png') no-repeat left center fixed;
            //  background-size: 1920px 980px;
            color: white;
            transition: all .3s;
            z-index: 90;
            white-space: nowrap;
             box-shadow:0 1px 4px 0px  #e0dede;
            &.active{
                width: 190px;
            }
        }
    }

</style>


<style lang="scss">
    body{
        background-color:#f4f5f9;
    }
</style>



