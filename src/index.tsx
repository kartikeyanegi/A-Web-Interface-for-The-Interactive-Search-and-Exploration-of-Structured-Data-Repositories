import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './bootstrap4-nyu-d3m.min.css';
import * as serviceWorker from './serviceWorker';

import { App } from './App';
ReactDOM.render(<App />, document.getElementById('root'));

// import { Experiment } from './components/Experiment/Experiment';
// ReactDOM.render(<Experiment />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
