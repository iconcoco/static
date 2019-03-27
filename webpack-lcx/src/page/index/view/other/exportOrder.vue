<template>
    <div class="banner text-page">
        <h2>Wish导出订单步骤</h2>
        <h3>第一步：登录wish商户后台https://www.merchant.wish.com/ 点击菜单栏【订单】-【完成订单】-【手动】。</h3>
        <p><img src="./../../../../images/login/wish-exp-1.png" alt=""></p>
        <h3>第二步：点击“下载交易记录”，选择“Download all transactions”，并选择相应的日期，点击确认按钮。</h3>
        <p><img src="./../../../../images/login/wish-exp-2.png" alt=""></p>
        <h3>第三步：wish会将您的订单发送到您绑定的邮箱，请您到绑定的邮箱查收您的wish订单。</h3>
        <p><img src="./../../../../images/login/wish-exp-3.png" alt=""></p>
        <h3>第四步：将Wish订单上传至CaresPAY商户后台，https://testuser.carespay.com</h3>
    </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {
    let header = document.getElementsByTagName(`header`);
    let footer = document.getElementsByTagName(`footer`);
    header[0].style.display = `none`;
    footer[0].style.display = `none`;
  }
};
</script>

<style lang="scss" scoped>
    h3{
        font-size: 20px;
        color: #4F81BD;
    }
</style>
