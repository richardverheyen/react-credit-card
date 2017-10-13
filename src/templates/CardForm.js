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
    this.showCardError = this.showCardError.bind(this);

    this.validateName = this.validateName.bind(this);
    this.showNameError = this.showNameError.bind(this);

    this.validateExpiry = this.validateExpiry.bind(this);
    this.showExpiryError = this.showExpiryError.bind(this);

    this.validateCvv = this.validateCvv.bind(this);
    this.showCvvError = this.showCvvError.bind(this);

    this.submitForm = this.submitForm.bind(this);
    this.submitTransaction = this.submitTransaction.bind(this);
    this.asyncPostToAPI = this.asyncPostToAPI.bind(this);
  }

  setTransaction(button) {
    let value = button.target.innerHTML.substr(1);
    this.setState({transaction: value});
    this.setState({transactionIsValid: true});
  }

  validateCreditCard(event) {

    const value = event ? event.target.value : this.state.creditCard;
    this.setState({creditCard: value});

    console.log(value);

    const isEmpty = value ? false : true;
    if (isEmpty) {
      return this.showCardError('Please enter number');
    }

    const regex = /^\d{16}$/g;
    const validFormat = regex.test(value);
    if (!validFormat) {
      return this.showCardError('Please enter 16 digits');
    }

    this.setState({ creditCardIsValid: true });
    this.setState({ creditCardError: null });

    this.deductCreditCardCompany(value);
  }

  deductCreditCardCompany(value){
    let ccvalues = {
      'mc':/5[1-5][0-9]{14}/,
      'ec':/5[1-5][0-9]{14}/,
      'vi':/4(?:[0-9]{12}|[0-9]{15})/,
      'ax':/3[47][0-9]{13}/,
      'dc':/3(?:0[0-5][0-9]{11}|[68][0-9]{12})/
    }
    for (let key in ccvalues) {
      if (!ccvalues.hasOwnProperty(key)) continue;
      let regex = ccvalues[key];
      if (regex.test(value)) {
        this.setState({cardServiceProvider: key})
      };
    }
  }

  showCardError(string) {
    console.error(string);
    this.setState({ creditCardIsValid: false });
    this.setState({ creditCardError: string })
  }

  validateName(event) {

    const value = event ? event.target.value : this.state.name;
    this.setState({name: value});

    const isEmpty = value ? false : true;
    if (isEmpty) {
      return this.showNameError('Please enter your name');
    }

    const regex = /^[a-z ,.'-]+$/i;
    const validFormat = regex.test(value);
    if (!validFormat) {
      return this.showNameError('Please enter a valid name');
    }

    this.setState({ nameIsValid: true });
    this.setState({ nameError: null });
  }

  showNameError(string) {
    console.error(string);
    this.setState({ nameIsValid: false });
    this.setState({ nameError: string })
  }

  validateExpiry(event) {

    const value = event ? event.target.value : this.state.expiry;
    this.setState({expiry: value});

    const isEmpty = value ? false : true;
    if (isEmpty) {
      return this.showExpiryError('Please enter your card\'s expiry date');
    }

    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const validFormat = regex.test(value);
    if (!validFormat) {
      return this.showExpiryError('Please enter your expiry date (MM/YY)');
    }

    this.setState({ expiryIsValid: true });
    this.setState({ expiryError: null });
  }

  showExpiryError(string) {
    this.setState({ expiryIsValid: false });
    this.setState({ expiryError: string })
  }

  validateCvv(event) {

    const value = event ? event.target.value : this.state.cvv;
    this.setState({cvv: value});

    const isEmpty = value ? false : true;
    if (isEmpty) {
      return this.showCvvError('Please enter your card\'s CVV number');
    }

    const regex = /^\d{3}$/;
    const validFormat = regex.test(value);
    if (!validFormat) {
      return this.showCvvError('Please enter a valid CVV number');
    }

    this.setState({ cvvIsValid: true });
    this.setState({ cvvError: null });
  }

  showCvvError(string) {
    console.error(string);
    this.setState({ cvvIsValid: false });
    this.setState({ cvvError: string })
  }

  submitForm(event) {
    event.preventDefault();

    // TODO: this.validateTransaction
    this.validateCreditCard();
    this.validateName();
    this.validateExpiry();
    this.validateCvv();

    const {transaction, creditCardIsValid, nameIsValid, expiryIsValid, cvvIsValid} = this.state;

    const formIsValid = transaction && creditCardIsValid && nameIsValid && expiryIsValid && cvvIsValid;

    if (formIsValid) { return this.submitTransaction(); }
  }

  submitTransaction() {
    if (this.state.submitting) { return; }
    const onSuccess = msg => {
      this.setState({submitting: false});
      this.setState({submitSuccess: true});
      console.debug('API request succesful!');
      console.log(msg);
    };
    const onFail = msg => {
      this.setState({submitting: false});
      console.error(`API request failed: "${msg}"`);
      // TODO: Show user API error
    };
    this.setState({submitting: true});
    console.log('Submitting to API ...');
    this.asyncPostToAPI().then(onSuccess, onFail);
  }

  asyncPostToAPI(onSuccess, onFail) {
    console.log('asyncPostToAPI');
    return new Promise((resolve, reject)=>{
      console.log('before setTimeout');
      return setTimeout(function(){
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
          (this.state.creditCardError ? 'show-error' : 'no-errors') + ' ' +
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
              (this.state.nameError ? 'show-error' : 'no-errors') + ' ' +
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
              (this.state.expiryError ? 'show-error' : 'no-errors') + ' ' +
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
              (this.state.cvvError ? 'show-error' : 'no-errors') + ' ' +
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

  componentDidMount(){
    const valueButtons = document.getElementById('values');
    valueButtons.addEventListener('click', function(e){
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
