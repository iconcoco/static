import React from 'react';
import {Switch,Route,HashRouter} from 'react-router-dom';

import App from './view/App.js';
import About from './view/About.js';

export default ()=>{
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/" component={App}/>
                <Route path="/About" component={About}/>
            </Switch>
        </HashRouter>
    )
}