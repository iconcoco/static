import 'whatwg-fetch'; //IE浏览器不兼容fetch

const joinFormParmas = params=>{
    let formStr = '';
    for (const key in params) {
        formStr += `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}&`
    };
    return formStr.substr(0,formStr.length-1);
};

class Request {
    //post请求
    post(url,params,type={json:false}){

        const BodyData =type.json ? JSON.stringify(params) : joinFormParmas(params)

        return new Promise((resolve,rejects)=>{
            fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type': type.json ? 'application/json':'application/x-www-form-urlencoded',
                    'charset' : 'utf-8'
                },
                credentials:'same-origin',  //将请求中的凭证包含在同一个网站中
                cache:'no-cache',
                mode: 'cors',
                body:BodyData,
            })
            .then(response=>{
                if(response.ok){
                    return response.json();
                }else{
                    throw new error('请求报错');
                }
            })
            .then(res=>{
                resolve(res);
            })
            .catch(err=>{
                rejects(err);
            })
        });
    }

    //get请求
    get(url,params){

        return new Promise((resolve,rejects)=>{
            fetch(`${url}?${joinFormParmas(params)}`,{
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded',
                    'charset' : 'utf-8'
                },
                credentials:'same-origin',  //将请求中的凭证包含在同一个网站中
                cache:'no-cache',
                mode: 'cors'
            })
            .then(response=>{
                if(response.ok){
                    return response.json();
                }else{
                    throw new error('请求报错');
                }
            })
            .then(res=>{
                resolve(res);
            })
            .catch(err=>{
                rejects(err);
            })
        });
    }
};

export default new Request();