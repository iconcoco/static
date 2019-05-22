import React from 'react';
import { Link } from 'react-router-dom';

export default class App extends React.Component{
    constructor(props){
        super();
    }

    render(){
        return (
            <div>
                Holle React!
                <ul>
                    <li><Link to="/About">关于我们说的是什么</Link></li>
                </ul>
            </div>
        )
    }
};
