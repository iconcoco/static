<template>
    <div class="record-container">
        <h3>提现申请记录</h3>
        <div class="table-container">
            <table class="table-title">
                <thead>
                    <tr>
                        <th class="per33 left">申请时间</th>
                        <th class="center">申请提现金额</th>
                        <th class="right per33">提现状态</th>
                    </tr>
                </thead>
            </table>
           <div>
                <table class="page-show">
                    <thead>
                        <tr>
                            <th class="per33 left"></th>
                            <th class="center"></th>
                            <th class="right per33"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!table.length">
                            <td class="center" style="border:none;" colspan="3">暂无提现记录</td>
                        </tr>
                        <tr v-else v-for="(item, index) in table" :key="index">
                            <td>{{item.createTime}}</td>
                            <td class="center">{{item.amount}}</td>
                            <td class="right">
                                <span v-if="item.status==1" class="no">待审核</span>
                                <span v-if="item.status==2" class="yes">已完成</span>
                            </td>
                        </tr>
                        <tr v-if="isDone">
                            <td class="center" style="border:none;height:0.6rem;" colspan="3">我是有底线的~</td>
                        </tr>
                    </tbody>
                </table>
           </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    import { spokesmanWithdrawRecord,spokesmanBankInfo } from '../../../uitls/api.js';

    let VueDom = null;

    let Record = {
        init:function(){
            this._event.bindScroll();
        },
        _event:{
            bindScroll:function(){

                let boxHeight = ($('.table-container div').height()-$(".record-container h3").height()+1);

                $('.table-container div').scroll(function(){

                    let tHeight = $('.page-show').height();
                    let a = tHeight-boxHeight;

                    if( $(this).scrollTop()==a){
                        VueDom.loadingQuery(VueDom.pageNum);
                    }
                });
            }
        }
    };

    export default{
        data(){
            return{
                table:[],
                pageNum:1,
                isDone:false
            }
        },
        created(){
           VueDom = this;
           spokesmanBankInfo().then(res=>{
               if(res.code==0){
                    if(!res.data){
                        this.$router.push({name:"spokesBindAccount"});//添加账户的页面
                    }else{
                        this.loadingQuery(1);
                    }
                }else{
                    alert(res.msg);
                }
           })
           
        },
        methods:{
            loadingQuery(n){
                
                !this.isDone && spokesmanWithdrawRecord({pageNum:n}).then(res=>{
                    if(res.code==0){
                       res.data.length ? (this.table = this.table.concat(res.data),this.pageNum = n + 1 ):
                       ( this.isDone = true );
                    }else{
                        alert(res.msg);
                    }
                })
            }
        },
        mounted(){
            Record.init();
        }
    }
</script>