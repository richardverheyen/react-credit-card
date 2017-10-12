import React, { Component } from 'react';

class CardForm extends Component {
  render() {
    return (
      <form>
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
