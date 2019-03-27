import template from './template.ejs';

module.exports={
    init(props){
        this.props = Object.assign({title:''},props);
        return this;
    },
    run(props){
        const renderData={
            body:props.body(),
            title:this.props.title,
            head:props.head ? props.head() : (function(){ return })()
        };
        return template(renderData)
    }
}