<template></template>

<script>
    export default{
        data(){
            return{
            }
        },
        created(){
           let name = this.$route.params.name;
           if(!name) return console.warn(`缺少name参数`),this.$router.push({ name:"index"});;
            this.$router.push({ name ,params:{ reflesh:true }});
           
        },
        mounted(){
          
        }
    }
</script>
