import React, { Component } from 'react';

class CardForm extends Component {
  render() {
    return (
      <form>
          <div>
            <button data-value="5">$5</button>
            <button data-value="10">$10</button>
            <button data-value="20">$20</button>
            <button data-value="40">$40</button>
            <button data-value="100">$100</button>
            <button data-value="250">$250</button>
            <button data-value="1000">$1000</button>
          </div>
          <input id="cardNumber" type="text" className="form-field" defaultValue="Credit card number"/>
          <div>
              <input id="owner" type="text" className="form-field" defaultValue="Name on card"/>
              <input id="expiry-date" type="text" className="form-field" defaultValue="MM/YY"/>
              <input id="cvv" type="text" className="form-field" defaultValue="CVC"/>
          </div>
          <button id="confirm-purchase" type="submit" className="btn green">Deposit funds</button>
      </form>
    );
  }
}

export default CardForm;
