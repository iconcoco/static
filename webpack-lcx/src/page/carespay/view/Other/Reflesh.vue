<template></template>

<script>
    export default{
        data(){
            return{

            }
        },
        created(){
            if(!this.$route.params.name) window.history.back();
            this.$router.push({
                name:this.$route.params.name,
                query:this.$route.query
            });
        }
    }
</script>
