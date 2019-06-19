<template>
    <router-view></router-view>
</template>

<script>
    export default{
        data(){
            return {}
        },
        mounted() {
             let IsIE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
             if (IsIE) {
                window.addEventListener('hashchange', () => {
                    let currentPath = window.location.hash.slice(1)
                    if (this.$route.path !== currentPath) {
                        this.$router.push(currentPath)
                    }
                }, false)
             } 
        },
    }
</script>
