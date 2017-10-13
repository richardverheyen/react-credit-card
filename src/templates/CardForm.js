import React, { Component } from 'react';

class CardForm extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
    // this.inputUpdated = this.inputUpdated.bind(this);
  }

  cardNumberUpdated(e) {
    //Check the card Number as it's updated
    let value = e.target.value;
    console.log(value);

  }

  submitTransaction(e) {
    e.preventDefault();
    //chosen funds?
    let funds;
    if (document.querySelector('.selected')) {
      let funds = document.querySelector('.selected').getAttribute('data-value');
    }


    //included card number?

    //included name?

    //included expiry-date?
    const datePattern = /^(0[1-9]|1[012])\/\d{2}$/;
    let dateTestPass = datePattern.test(document.getElementById('expiry-date').value);
    console.log('dateTestPass = ' + dateTestPass);

    //included cvc?
    const cvvPattern = /^\d{3}$/;
    let cvvTestPass = cvvPattern.test(document.getElementById('cvv').value);
    console.log('cvvTestPass = ' + cvvTestPass);

  }

  render() {
    return (
      <form id="card-form" onSubmit={this.submitTransaction}>
          <div id="values">
            <button className="button" data-value="5">$5</button>
            <button className="button" data-value="10">$10</button>
            <button className="button" data-value="20">$20</button>
            <button className="button" data-value="40">$40</button>
            <button className="button" data-value="100">$100</button>
            <button className="button" data-value="250">$250</button>
            <button className="button" data-value="1000">$1000</button>
          </div>
          <input
            id="card-number"
            type="text"
            className="form-field"
            placeholder="Credit card number"
            maxLength="16"
            onInput={this.cardNumberUpdated}
          />
          <div>
              <input
                id="owner"
                type="text"
                className="form-field"
                placeholder="Name on card"/>
              <input
                id="expiry-date"
                type="text"
                className="form-field"
                placeholder="MM/YY"
                pattern="[0-9]{2}/[0-9]{2}"/>
              <input
                id="cvv"
                type="text"
                className="form-field"
                placeholder="CVC"
                maxLength="3"
                pattern="[0-9]{3}"/>
          </div>
          <button id="confirm-purchase" type="submit" className="button green">Deposit funds</button>
      </form>
    );
  }

  componentDidMount(){
    const valueButtons = document.getElementById('values');
    valueButtons.addEventListener("click", function(e){
      e.preventDefault();
      this.childNodes.forEach(child => {
        child.classList.remove("selected")
      });
      e.target.className += ' selected';
    });
  }
}

export default CardForm;
