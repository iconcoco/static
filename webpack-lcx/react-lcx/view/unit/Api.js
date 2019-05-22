import Request from './request.js';

export const Login = params => Request.post('/login',params);
export const GetList = params => Request.get('/dictionary/getList',params);