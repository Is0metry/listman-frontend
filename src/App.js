import React, { Component } from 'react';
import List from './List';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <List url="http://localhost:8080"/>
    );
  }
}

export default App;
