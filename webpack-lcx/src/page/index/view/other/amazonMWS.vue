<template>
    <div class="banner text-page">
        <h2>Amazon 美国店铺获取 MWS 编码教程</h2>
        <div>以下操作不会造成 Amazon 平台账户的关联，请放心添加。 </div>
        <div>
            <b>注意：非美国账号的用户，请先登录卖家中心，点击右上角 setting-account info，找到 Feed Processing Report Language 一栏，确认语言为 English(US)。若不是，点击右侧 edit，在新页面中选中 English(US)并提交</b>
        </div>
        <br>
        <h3>第一步：请登录 <a href="https://developer.amazonservices.com/">https://developer.amazonservices.com/</a> ，点击 Sign up or manage Amazon MWS</h3>
        <div>
            <img src="../../../../images/login/a1.jpg" alt="">
        </div>
        <br>
        <h3>第二步：登录Amazon账户</h3>
        <div>
            <img src="../../../../images/login/a2.jpg" alt="">
        </div>
        <br>
        <h3>第三步：验证手机号码，填入验证码；如未开启验证，则无需此步</h3>
        <div>
            <img src="../../../../images/login/a3.jpg" alt="">
        </div>
        <br>
        <h3>第四步：</h3>
        <p>若为首次获取MWS编码，则出现下图，点击左下角“注册为开发人员”：</p>
        <div>
            <img src="../../../../images/login/a4.jpg" alt="">
        </div>
        <p>完善对应亚马逊店铺的信息，电子邮件为注册店铺 填写公司联系信息后，获取编码</p>
        <div>
            <img src="../../../../images/login/a4(2).jpg" alt="">
        </div>
        <div>
            <img src="../../../../images/login/a4(3).jpg" alt="">
        </div>
        <div>
            <img src="../../../../images/login/a4(5).jpg" alt="">
        </div>
        <p>卖家ID则在以下界面获取：</p>
        <div>
            <img src="../../../../images/login/a4(6).jpg" alt="">
        </div>
        <p>获取完 卖家ID后，将卖家ID、 AWS码、密钥复制填写到CaresPAY平台上即可。</p>
        <br>
        <h3>第五步: 若曾已获取过MWS编码，则直接点击查看您的凭证</h3>
        <div>
            <img src="../../../../images/login/a5.jpg" alt="">
        </div>
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