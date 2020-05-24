import React from 'react';
import logo from './texas_imprint.png';
import './voterForm.css';
import './Logo.css';

console.log(logo);

function Header() {
  return <img src={logo} alt="Logo" className="center"/>;
}

class TextInput extends React.Component {
constructor(props) {
    super(props);

    this.state = {
      active: (props.locked && props.active) || false,
      value: props.value || "",
      error: props.error || "",
      label: props.label || "Label",
      name:  props.name || "input"
    };
  }

  changeValue(event) {
    const value = event.target.value;
    this.setState({ value, error: "" });
  }

  handleKeyPress(event) {
    if (event.which === 13) {
      this.setState({ value: this.props.predicted });
    }
  }

  render() {
    const { active, value, error, label, name } = this.state;
    const { predicted, locked } = this.props;
    const fieldClassName = `field ${(locked ? active : active || value) &&
      "active"} ${locked && !active && "locked"}`;

    return (
      <div className={fieldClassName}>
        {active &&
          value &&
          predicted &&
          predicted.includes(value) && <p className="predicted">{predicted}</p>}
        <input
          id={1}
          name={name}
          type="text"
          value={value}
          placeholder={label}
          onChange={this.changeValue.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          onFocus={() => !locked && this.setState({ active: true })}
          onBlur={() => !locked && this.setState({ active: false })}
        />
        <label htmlFor={1} className={error && "error"}>
          {error || label}
        </label>
      </div>
    );
  }
}

function importCountyElectionInformation(){
  const excelToJson = require('convert-excel-to-json');
  const result = excelToJson({
    sourceFile: '/src/election-duties-1.xlsx'
  });
  console.log(result);
}

class VoterForm extends React.Component {
  
  componentDidMount(){
    //{importCountyElectionInformation()};
    fetch('https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDATZ2arFUsfIjTF8CkufwKdUjH7fM5eVg&address=1300%20Newning%20Ave.%20Austin%20TX&electionId=2000').then(function(response) {
      return response.json(); 
    }).then(function(j) {
      console.log(j);
      console.log(j.normalizedInput.line1 + ' ' + j.normalizedInput.city + ', ' + j.normalizedInput.state); 
      console.log(j.state[0].local_jurisdiction.name);
    }).catch(console.log);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const fname = data.get('fname');
    const lname = data.get('lname');
    const street = data.get('street');
    const city = data.get('city');
    const zip = data.get('zip');
    console.log(data);
    var str = "mailto:dana.debeauvoir@traviscountytx.gov?subject=Request for Application for Ballot by Mail&body=";
    str += "I am writing this email to request to request an application for ballot by mail for the upcoming election.%0D%0A%0D%0A";
    str += "My name is " + fname + " " + lname + " and my home address is:%0D%0A";
    str += street + "%0D%0A" + city + ", TX " + zip + "%0D%0A%0D%0A";
    str += "Thank you very much,%0D%0A" + fname + " " + lname + "%0D%0A";
    window.open(str, "_blank");
  }

  render() {
    return (
      <div>
        <div className="Header">
          <Header />
        </div>
        <div className="Form">
        <form onSubmit={this.handleSubmit} method="get" encType="text/plain">
          <TextInput label="First Name" name="fname"/>
          <TextInput label="Last Name" name="lname"/>
          <TextInput label="Street" name="street"/>
          <TextInput label="City" name="city"/>
          <TextInput label="Zip Code" name="zip"/>
          <div className="field">
            <input type="submit" value="Submit" />
          </div>
        </form>
        </div>
      </div>
    );
  }
}

export default VoterForm;
