<template>
    <div class="admin-modal-bg"  :class="switchClass">
        <div class="modal-container" :class="{fadeIn:isShow}">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            isShow:false,
            switchClass:null,
            timmer :null
        }
    },
     props:{
        "value":{
            required: true
        },
    },
     mounted(){
        this.isShow = this.value;
        // this.watchvaluechange(this.value);
        this.switchClass =this.value ? "active" :null;
    },
     watch:{
        value(val){
            this.isShow = val;
            this.watchvaluechange(val);
        },
    },
    methods:{
        watchvaluechange(bol){
           
            if(bol){
                clearTimeout(this.timmer);
                this.switchClass = "active";
            }else{
                this.switchClass = "adminFadeOut";
                this.transitionEnd();
            }
        },
        transitionEnd(){
            clearTimeout(this.timmer);
            this.timmer = setTimeout(() => {
                this.switchClass = null;
            }, 500);
        }
    }
    
}
</script>

<style lang="scss" scoped>

.admin-modal-bg{
    background-color: rgba(0,0,0,.5);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: none;
    z-index: -60;

    &.active{
         z-index: 100;
        display: block;
    }

    &.adminFadeOut{
         z-index: 100;
         display: block;
         transition: all .2s;
         animation: adminFadeOut .2s linear forwards;
    }

    .el-popover{
        background-color: transparent;
    }
}
    .modal-container{
        position: absolute;
        min-width: 300px;
        min-height: 30px;
        left: 5%;
        top: 100px;
        border-radius:6px;
        padding: 10px;
    }

@keyframes adminFadeOut {
    0%{
        opacity: 1;
    }
    100%{
        opacity: 0;
    }
}
</style>
