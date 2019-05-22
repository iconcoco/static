import React from 'react';

import {
    Login,
    GetList
} from './../unit/Api.js';

export default class Topic extends React.Component{
    constructor(props){
        super(props);
        // console.log(props);
    }
    //进行网络请求
    toFetch(){
        // console.log('网络请求！'  /dictionary/getList)
        Login({
            userCode:'lichengxiang',
            userPwd:'abc123456'
        }).then(res=>{
            if(res.code==0){
                alert('登录成功');
            }
        })
    }

    toGetFetch(){
        GetList({
            type:2
        }).then(res=>{
            if(res.code==0){
                alert('请求成功');
            }
        })
    }

    render(){
        return (
            <div>
                <p>{ this.props.match.params.topicId }</p>
                <button onClick={ this.toFetch.bind(this) }>一个post请求登录按钮</button>
                <button onClick={ this.toGetFetch.bind(this) }>一个get请求按钮</button>
            </div>
        )
    }
}

