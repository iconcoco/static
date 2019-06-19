const App = require('express')();


App.get('/',(req,res)=>{
    res.send(`Hello world!`);
}).listen(8081,'127.0.0.1',()=>{
    console.log('server is running at http://127.0.0.1:8081');
});