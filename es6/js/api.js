let [name,age,addre] = ["jack",22,"深圳"];

/*
	export命令规定的是对外的接口，必须与模块内部的变量建立一一对应关系!
*/

module.exports= {name,age,addre};