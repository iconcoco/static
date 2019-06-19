
class Router{
    constructor(url){

        this.URL = url;

    }

    returnFile(){
        switch(this.URL){
            case '/':{  return `首页`  } break;
            case '/music':{  return `音乐节目`  } break;
            case '/person':{  return `个人中心`  } break;
            default :{
                return  `对不起页面找不到`
            }
        }

    }

}

module.exports ={
    Router,
}