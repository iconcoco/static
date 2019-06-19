<template>
    <div class="login-container">
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
     .banner{
        width: 80%;
        height: 100%;
        margin: 0 auto;
        position: relative;
    }

    .login-container{
        width: 100%;
        height: 100%;
        background: url('../../image/login/loginBg.png') no-repeat center center fixed;
        // background-size: 100%;
    }
</style>
