/**
 * 
 * @param {*} params 
 * ele 绑定导出表格的元素
 * name 导出表格的文件名
 * title  表头的数据 ["第一列","第二列","第二列","第二列"]
 * body  表格数据部分  是个数组,[["第一排",11,22,33,44],["第二排",11,22,33,44],]
 */

var ExportExcel = function(params){
    this.writeDoc(params);

}

ExportExcel.prototype = {
    constructor:ExportExcel,
    excel:function(ele, content, name){
        // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
        var html = "<html><head><meta charset='utf-8' /></head><body>" + content + "</body></html>",
        // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
        blob = new Blob([html], { type: "application/vnd.ms-excel" });
        // 利用URL.createObjectURL()方法为a元素生成blob URL
        var element =  document.querySelector(ele)
        element.setAttribute("href",URL.createObjectURL(blob));
        // 设置文件名，目前只有Chrome和FireFox支持此属性
        element.setAttribute("download",name + ".xls");
    },
    writeDoc:function(params){

            var header = ["<th></th>"],
                body = [],
                content = "<table><thead><tr>";
            //1.循环表头   
            params.title.forEach(function(v){
                header.push("<th>" + v + "</th>");
            });

            header.push("</tr></thead><tbody>");
            //2.循环遍历表格的元素
            params.body.forEach(function(v) {
                //v代表每个对象 一个对象要伊特tr
                var list = "<tr>";
                if(v instanceof Array){
                        
                    v.forEach(function(i){
                        list += "<td>" + i + "</td>";
                    });
                }

                list += "</tr>";
                body.push(list);
            });
            body.push("</tbody></table>");
            //合并两个数组 变为字符串
            var total = header.concat(body),
                totalStr = total.join("");
            content += totalStr;
            //导出表格
            this.excel(params.ele, content, params.name);
    }
}