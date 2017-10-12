import React, { Component } from 'react';
import CardForm from './CardForm';

class App extends Component {
  render() {
    return (
      <div id="app">
        <h1>Deposit Funds</h1>
        <p>$2,100,321 won in the last 24 hours</p>
        <CardForm />
      </div>
    );
  }
}

export default App;
