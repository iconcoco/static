<template>
    <div class="pagination" v-if="total>0">
        <div class="per-page">
            每页：<input  @change="inputChange" class="cares-input" type="Number" maxlength="3" v-model="size">条
            <!-- <el-input @change="inputChange" type="Number" maxlength="3" v-model="size" ></el-input> -->
        </div>

        <div class="p-container clearfix">
             <template v-if="total>15">
                <a href="javascript:;" class="pre" v-if="current!=1" @click="bindchosepage(current-1)"></a>

                <!-- 如果当前的页码距离靠前 -->
                <template v-if="current<=8">
                     <a v-for="n in current" :key="n" @click="bindchosepage(n)"  :class="{active:n==current}" href="javascript:;">{{n}}</a>
                     <span>...</span>
                    <a href="javascript:;" @click="bindchosepage(total-2)">{{total-2}}</a>
                    <a href="javascript:;" @click="bindchosepage(total-1)">{{total-1}}</a>
                    <a href="javascript:;" @click="bindchosepage(total)">{{total}}</a>
                </template>

                <!-- 如果当前页码在中间 -->
                <template v-if="current>8&&total-current>=5">
                    <a v-for="n in 4" :key="n" href="javascript:;">{{n}}</a>
                    <span>...</span>
                    <a href="javascript:;"  @click="bindchosepage(current-1)">{{current-1}}</a>
                    <a href="javascript:;" class="active" @click="bindchosepage(current)">{{current}}</a>
                    <a href="javascript:;" @click="bindchosepage(current+1)">{{current+1}}</a>
                    <span>...</span>
                     <a href="javascript:;" @click="bindchosepage(total-2)">{{total-2}}</a>
                    <a href="javascript:;" @click="bindchosepage(total-1)">{{total-1}}</a>
                    <a href="javascript:;" @click="bindchosepage(total)">{{total}}</a>

                </template>

                <!-- 如果当前的页码比较靠后 -->
                <template v-if="total-current<5">
                     <a v-for="n in 5" :key="n" href="javascript:;" @click="bindchosepage(n)">{{n}}</a>     
                     <span>...</span>                  
                    <a href="javascript:;" v-for="n in atLast" :key="n" @click="bindchosepage(n)" :class="{active:n==current}">{{n}}</a>
                </template>

                <a href="javascript:;" class="next" @click="bindchosepage(current+1)" v-if="current!=total"></a>
            </template>

            <template v-else>
                <template v-if="total==1">
                    <a href="javascript:;" class="pre"></a>
                    <a class="active" href="javascript:;">1</a>
                    <a href="javascript:;" class="next"></a>
                </template>
                
                <template v-else>
                    <a href="javascript:;" class="pre"  v-if="current!=1" @click="bindchosepage(current-1)"></a>
                    <a v-for="n in total" :key="n" :class="{active:n==current}"  @click="bindchosepage(n)" href="javascript:;">{{n}}</a>
                    <a href="javascript:;" class="next"  @click="bindchosepage(current+1)"  v-if="current!=total"></a>
                </template>
                
            </template>
        </div>

        <div class="jumper">
            <span>跳至</span>
            <input class="cares-input" type="Number" @change="jumpToPage" v-model="jump">
            <span>页</span>
        </div>

        <div class="jumper" v-if="countSize">共{{countSize}}条</div>
    </div>
</template>

<script>
    /**
     * 分页组件
     * author:lcx
     * 641616451@qq
     * 组件参数：
     *      page :当前页码
     *      pageSize:每页的总数
     *      count:页码总数
     *      countSize: 总共多少条记录
     *      chosefallback:点击页码之后的函数，接收一个页码参数；
     */
    export default{
        data(){
            return{
                current:'',
                total:'',
                jump:'1',
                atLast:[],
                size:10,
                per:[10,15,20,25]
            }
        },
        props:{
            'page':{
                required: true
            },
            'pageSize':{
                required: false
            },
            'count':{
                required: true
            },
            'chosefallback':{
                required: true
            },
            'countSize':{ 
                required: false
            }
            
        },
        created() {
            this.current = Number(this.page);
            this.total   = Number(this.count);
            this.size   = Number(this.pageSize || 10);
            

            if(this.total>15&&(this.total-this.current<5)){
                this.atLast =[];
                for(let i = (this.current-1);i<=this.total;i++){
                     this.atLast.push(i);
                }
            }
        },
        watch:{
            page(n){
                this.current = Number(n);

                if(this.total>15&&(this.total-this.current<5)){
                    this.atLast =[];
                    for(let i = (this.current-1);i<=this.total;i++){
                        this.atLast.push(i);
                    }
                }
            },
            count(n){
                this.total = Number(n);
            },
            pageSize(n){
                this.size = Number(n);
            }
        },
        methods:{
            bindchosepage(val){
                if(val == this.current) return;
                this.chosefallback(val,this.size);
            },
            jumpToPage(){

                if(this.jump > this.total) this.jump = 1;
                if(this.jump == this.current) return;
                this.chosefallback(this.jump,this.size);
            },
            inputChange(){
                this.jump = 1;
               this.chosefallback(1,this.size);
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./../css/common/theme.scss";

    .el-input,
    .el-button{
        vertical-align: top;
        height: 34px;
        line-height: 34px;
    }

    .el-input{
         width: 50px;
    }

    label{
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        color: #666;
        vertical-align: top;
    }



    // .el-input{
    //     width: 50px;
    //     height: 28px;
    //     line-height: 28px;
    // }

    .pagination{
        display: block;
        text-align: right;
        background-color: #fff;
        position: relative;
        padding-bottom: 20px;
        .p-container{
            display: inline-block;
            vertical-align: middle;
        
        
            a:hover{
                // background-color: #f7f5ef;
                // font-weight: bold;
                color:  $--color-primary-two;
            }
            a.active{
                // color: #fff;
                // border-color: $--color-primary-two;
                // background-color: $--color-primary-two;
                color: $--color-primary-two;
            }

            a,span{
                display: block;
                width: 30px;
                height: 30px;
                line-height: 30px;
                text-align: center;
                // border:1px solid #ddd;
                // background-color: #fafafa;
                color: #999;
                float: left;
                // margin-left: -1px;
                font-size: 14px;
                margin: 0 5px;
                border-radius: 4px;
            }

            span{
                background-color: #fff;
                border: 0;
                margin-left: 0px;
            }
            .pre{
                background: url('./../images/carepay/arrow-left-o.svg') no-repeat center center;
                background-size: 50% 50%;
                &:hover{
                background-image: url('./../images/carepay/arrow-left-o-hover.svg') ;
                }
            }
            .next{
                background: url('./../images/carepay/arrow-right-o.svg') no-repeat center center;
                background-size: 50% 50%;
                &:hover{
                background-image: url('./../images/carepay/arrow-right-o-hover.svg') ;
                }
            }
        }
         .jumper{
            // position: absolute;
            // top: 0;
            // right: 0;
            display: inline-block;
            color: #666;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            vertical-align: middle;
            margin-left: 10px;
            .cares-input{
                width: 40px;
                height: 28px;
                background-color: #fff;
                vertical-align: middle;
                margin-right: 5px;
                // border: 1px solid #ECECEC;
            }

        }
        .per-page{
            position: absolute;
            top: 0;
            left: 0;
             color: #666;
             font-size: 14px;
           .cares-input{
                width: 40px;
                height: 28px;
                background-color: #fff;
                vertical-align: middle;
                margin-right: 5px;
                // border: 1px solid #ECECEC;
            }
        }
    }

</style>