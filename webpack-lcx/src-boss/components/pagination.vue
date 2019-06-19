<template>
    <div class="pagination" v-if="total>0">
        <div class="per-page">
            每页：<input  @change="inputChange" class="cares-input" type="Number" maxlength="3" v-model="size">条
            <!-- <el-input @change="inputChange" type="Number" maxlength="3" v-model="size" ></el-input> -->
        </div>

        <div class="p-container clearfix">
             <template v-if="total>15">
                <a href="javascript:;" class="pre el-icon-arrow-left" v-if="current!=1" @click="bindchosepage(current-1)"></a>

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

                <a href="javascript:;" class="next el-icon-arrow-right" @click="bindchosepage(current+1)" v-if="current!=total"></a>
            </template>

            <template v-else>
                <template v-if="total==1">
                    <a href="javascript:;" class="pre el-icon-arrow-left"></a>
                    <a class="active" href="javascript:;">1</a>
                    <a href="javascript:;" class="next el-icon-arrow-right"></a>
                </template>
                
                <template v-else>
                    <a href="javascript:;" class="pre el-icon-arrow-left"  v-if="current!=1" @click="bindchosepage(current-1)"></a>
                    <a v-for="n in total" :key="n" :class="{active:n==current}"  @click="bindchosepage(n)" href="javascript:;">{{n}}</a>
                    <a href="javascript:;" class="next el-icon-arrow-right"  @click="bindchosepage(current+1)"  v-if="current!=total"></a>
                </template>
                
            </template>
        </div>

        <div class="jumper">
            <!-- <el-button type="primary" @click="jumpToPage" plain>跳到</el-button> -->
            <span>跳到</span>
            <input class="cares-input" type="Number" @change="jumpToPage" v-model="jump">页
            <!-- <el-input v-model="jump" placeholder=""></el-input> -->
        </div>
      
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
    @import "../css/element-variables.scss";

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
        text-align: center;
        background-color: #fff;
        position: relative;
        padding-bottom: 20px;
        .p-container{
            display: inline-block;
        }
        .jumper{
            position: absolute;
            top: 0;
            right: 0;
            color: #666;
            .cares-input{
                width: 54px;
                background-color: #fff;
                border: 1px solid #ECECEC;
            }
        }
        .per-page{
            position: absolute;
            top: 0;
            left: 0;
             color: #666;
           .cares-input{
                width: 54px;
                background-color: #fff;
                border: 1px solid #ECECEC;
            }
        }
        a:hover{
            background-color: $--color-primary-hover;
            // font-weight: bold;
        }
        a.active{
            color: #fff;
            border-color: $--color-primary;
            background-color: $--color-primary;
        }

        a,span{
            display: block;
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border:1px solid #ddd;
            background-color: #fafafa;
            color: #666;
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
        // .pre{
        //     width: auto;
        //     padding: 0 10px; 
        //     border-radius: 4px 0 0 4px;
        // }
        // .next{
        //     width: auto;
        //     padding: 0 10px;
        //      border-radius: 0  4px  4px 0;
        // }
    }

</style>

