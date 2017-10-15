import React, { Component } from 'react';

class CardForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      transaction: null,
      transactionIsValid: false,
      name: null,
      nameIsValid: false,
      nameError: null,
      expiry: null,
      expiryIsValid: false,
      expiryError: null,
      cvv: null,
      cvvIsValid: false,
      cvvError: null,
      creditCard: null,
      creditCardIsValid: false,
      creditCardError: null,
      submitting: false,
      submitSuccess: false,
      cardServiceProvider: null
    };
    this.setTransaction = this.setTransaction.bind(this);
    this.validateCreditCard = this.validateCreditCard.bind(this);
    this.validateName = this.validateName.bind(this);
    this.validateExpiry = this.validateExpiry.bind(this);
    this.validateCvv = this.validateCvv.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
    this.asyncPostToAPI = this.asyncPostToAPI.bind(this);
  }

  setTransaction(button) {
    const value = button.target.innerHTML.substr(1);
    this.setState({
      transaction: value,
      transactionIsValid: true
    });
  }

  showError(attribute, errorMsg) {
    const hash = {
      [`${attribute}Error`]: errorMsg,
      [`${attribute}IsValid`]: false
    };
    this.setState(hash);
  }

  // Check whether the credit card number is correct, show error if false
  validateCreditCard(event) {
    const value = event ? event.target.value : this.state.creditCard;
    this.setState({ creditCard: value });

    const isEmpty = value ? false : true;
    if (isEmpty) { return this.showError('creditCard', 'Please enter your card number'); }

    const regex = /^\d{16}$/g;
    const validFormat = regex.test(value);
    if (!validFormat) { return this.showError('creditCard', 'Please enter 16 digits'); }

    this.setState({
      creditCardIsValid: true,
      creditCardError: null
    });

    this.deductCreditCardCompany(value);
  }

  // Interpret the credit card company from the credit card number and show confirmation in UI
  deductCreditCardCompany(creditCardNumber) {
    const ccvalues = {
      'mc': /5[1-5][0-9]{14}/,
      'ec': /5[1-5][0-9]{14}/,
      'vi': /4(?:[0-9]{12}|[0-9]{15})/,
      'ax': /3[47][0-9]{13}/,
      'dc': /3(?:0[0-5][0-9]{11}|[68][0-9]{12})/
    }
    for (let key in ccvalues) {
      if (!ccvalues.hasOwnProperty(key)) continue;
      let regex = ccvalues[key];
      if (regex.test(creditCardNumber)) {
        this.setState({ cardServiceProvider: key })
      };
    }
  }

  // Check whether the user name is correct, show error if false
  validateName(event) {
    const value = event ? event.target.value : this.state.name;
    this.setState({ name: value });

    const isEmpty = value ? false : true;
    if (isEmpty) { return this.showError('name', 'Please enter your name'); }

    const regex = /^[a-z ,.'-]+$/i;
    const validFormat = regex.test(value);
    if (!validFormat) { return this.showError('name', 'Please enter a valid name'); }

    this.setState({
      nameIsValid: true,
      nameError: null,
    });
  }

  // Check whether the expiry date is correct, show error if false
  validateExpiry(event) {
    const value = event ? event.target.value : this.state.expiry;
    this.setState({ expiry: value });

    const isEmpty = value ? false : true;
    if (isEmpty) { return this.showError('expiry', `Please enter your card's expiry date`); }

    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const validFormat = regex.test(value);
    if (!validFormat) { return this.showError('expiry', 'Please enter your expiry date (MM/YY)'); }

    this.setState({
      expiryIsValid: true,
      expiryError: null
    });
  }

  // Check whether the CVV is correct, show error if false
  validateCvv(event) {
    const value = event ? event.target.value : this.state.cvv;
    this.setState({ cvv: value });

    const isEmpty = value ? false : true;
    if (isEmpty) { return this.showError('cvv', 'Please enter your card\'s CVV number'); }

    const regex = /^\d{3}$/;
    const validFormat = regex.test(value);
    if (!validFormat) { return this.showError('cvv', 'Please enter a valid CVV number'); }

    this.setState({
      cvvIsValid: true,
      cvvError: null
    });
  }

  submitForm(event) {
    event.preventDefault();

    // TODO: this.validateTransaction
    this.validateCreditCard();
    this.validateName();
    this.validateExpiry();
    this.validateCvv();

    const { transaction, creditCardIsValid, nameIsValid, expiryIsValid, cvvIsValid } = this.state;

    const formIsValid = transaction && creditCardIsValid && nameIsValid && expiryIsValid && cvvIsValid;

    if (formIsValid) {
      return this.submitTransaction();
    } else {
      // TODO: This bit breaks, errorFields is null
      // const errorFields = document.querySelector('.not-valid');
      // errorFields.classList += ' show-error';
    }
  }

  // Submit the form to our API and handle the `onSucces` or `onFail`
  submitTransaction() {
    if (this.state.submitting) { return; }
    const onSuccess = msg => {
      this.setState({
        submitting: false,
        submitSuccess: true
      });
      console.log(`API request succesful! ${msg}`);
      // TODO: Transition user to success page
    };
    const onFail = msg => {
      this.setState({ submitting: false });
      console.error(`API request failed. ${msg}`);
      // TODO: Show user API error
    };
    this.setState({ submitting: true });
    console.log('Submitting to API ...');
    this.asyncPostToAPI().then(onSuccess, onFail);
  }

  // Mock a POST request to our API and resolve / reject after 2 seconds
  asyncPostToAPI(onSuccess, onFail) {
    return new Promise((resolve, reject) => {
      return setTimeout(function() {
        resolve('status 200: the payment was accepted');
        // reject('status 422: the payment request was rejected');
      }, 2000);
    });
  }

  render() {
    return (
      <form id="card-form" onSubmit={this.submitForm}>
        <div id="values">
          <button onClick={this.setTransaction}>$5</button>
          <button onClick={this.setTransaction}>$10</button>
          <button onClick={this.setTransaction}>$20</button>
          <button onClick={this.setTransaction}>$40</button>
          <button onClick={this.setTransaction}>$100</button>
          <button onClick={this.setTransaction}>$250</button>
          <button onClick={this.setTransaction}>$1000</button>
        </div>
        <div
          id="card-number"
          className={"field " +
          (this.state.creditCardIsValid ? 'is-valid' : 'not-valid')}>
          <input
            type="text"
            placeholder="Credit card number"
            maxLength="16"
            autoComplete="off"
            className= {(this.state.cardServiceProvider) ? this.state.cardServiceProvider : ''}
            onBlur={this.validateCreditCard}/>
          <div className="errors">
            <p>{this.state.creditCardError}</p>
          </div>
        </div>
        <div>
          <div
            id="owner"
            className={"field " +
            (this.state.nameIsValid ? 'is-valid' : 'not-valid')}>
            <input
            type="text"
            autoComplete="off"
            placeholder="Name on card"
            onBlur={this.validateName}/>
            <div className="errors">
              <p>{this.state.nameError}</p>
            </div>
          </div>
          <div
            id="expiry-date"
            className={"field " +
            (this.state.expiryIsValid ? 'is-valid' : 'not-valid')}>
            <input
            type="text"
            placeholder="MM/YY"
            autoComplete="off"
            pattern="[0-9]{2}/[0-9]{2}"
            onBlur={this.validateExpiry}/>
            <div className="errors">
              <p>{this.state.expiryError}</p>
            </div>
          </div>
          <div
            id="cvv"
            className={"field " +
            (this.state.cvvIsValid ? 'is-valid' : 'not-valid')}>
            <input
            type="text"
            placeholder="CVV"
            maxLength="3"
            autoComplete="off"
            pattern="[0-9]{3}"
            onBlur={this.validateCvv}/>
            <div className="errors">
              <p>{this.state.cvvError}</p>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className={"green " + (this.state.submitting ? 'loading' : 'idle' )}>
          {(this.state.submitSuccess ? `Transfer of $${this.state.transaction} Successful!` : (this.state.submitting ? 'Submitting' : 'Deposit funds'))}
        </button>
      </form>
    );
  }

  // TODO: Bind this events onRender rather than hacking DOM afterRender
  componentDidMount() {
    const valueButtons = document.getElementById('values');
    valueButtons.addEventListener('click', function(e) {
      e.preventDefault();
      if (e.target.classList.contains('selected')) { //Remove selection on second click
        this.childNodes.forEach(child => {
          child.classList.remove('selected');
        });
      } else { //Add the 'selected' class
        this.childNodes.forEach(child => {
          child.classList.remove('selected');
        });
        e.target.className += ' selected';
      }
    });
  }
}

export default CardForm;
