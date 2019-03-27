<template>
    <div class="container" :style="`height:${ height }px`">
        <ul @mouseover="bindSwiperHover" @transitionend="transitionEnd"  @mouseout="bindHoverOut" class="swiper-box" :class="{active:flag}" :style="`transform:${ transform() }`">
            <li :style="`height:${ height }px`" v-for="(item,index) in data" :key="index" v-html="item.content"></li>
            <li :style="`height:${ height }px`" v-if="data.length>1" v-html="data[0].content"></li>
        </ul>
    </div>
</template>

<script>
    export default{
        data(){
            return{
                num:0,
                timer:null,
                flag:true
            }
        },
        props:{
            'data':{
                required:true,
                type:Array
            },
            'height':{
                required:true,
            }
        },
        created() {
           this.swiper();
        },
        methods:{
            swiper(){
                let data = this.data;
                if(data.length<=1) return;
                
                let length = data.length;

                this.timer = setInterval(()=>{
                    this.flag = true;
                    this.num++;
                },3000);
            },
            transform(){
                return `translateY(-${ this.height*this.num }px)`
            },
            bindSwiperHover(){
                clearInterval(this.timer);
            },
            bindHoverOut(){
                this.swiper();
            },
            transitionEnd(){
                if(this.num >= this.data.length){
                    this.flag = false;
                    this.num=0
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .container{
        overflow: hidden;
    }

    .swiper-box{
       &.active{
            transition: all .5s;
       }
    }
</style>

