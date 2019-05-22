import React from 'react';
import {Link,Route,Switch} from 'react-router-dom';

import Topic from './component/topic.js';

export default class About extends React.Component{
    constructor(props){
        super();
    }

    jumpToIndex(){
        this.props.history.push({
            pathname:'/',
        })
    }

    render(){
        return (
            <div> 
                How About!! 
                <p> <Link to="/">返回主页</Link> </p>
                <p onClick={ this.jumpToIndex.bind(this) }> 通过js跳转到主页 </p>

                 <ul>
                    <li>
                        <Link to={`${this.props.match.url}/Rendering`}>Rendering with React</Link>
                    </li>
                    <li>
                        <Link to={`${this.props.match.url}/Components`}>Components</Link>
                    </li>
                    <li>
                        <Link to={`${this.props.match.url}/Props`}>Props v. State</Link>
                    </li>
                </ul>

                <Switch>
                    <Route exact path={`${this.props.match.url}/:topicId`} component={Topic} />
                    {/* <Route
                        exact
                        path={`${this.props.match.url}`}
                        render={() => <h3>Please select a topic.</h3>}
                    /> */}
                </Switch>
            </div>
        )
    }
}
