import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';
import Header from './components/header';
import Home from './components/home';
import Address from './components/address';

class App extends Component {
  render() {
    return (
        <Router>
            <div className="App">
                <Header />

                <Route exact path="/" component={Home} />
                <Route path="/wallet" component={Address} />
            </div>
        </Router>
    );
  }
}

export default App;
