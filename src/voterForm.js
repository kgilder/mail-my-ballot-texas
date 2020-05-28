import React from 'react';
import Select from 'react-select';
import logo from './texas_imprint.png';
import './voterForm.css';
import './Logo.css';

console.log(logo);

function Header() {
  return <img src={logo} alt="Logo" className="center"/>;
}

class SelectInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      active: (props.locked && props.active) || false,
      label: props.label || "Label",
      name:  props.name || "menu",
      selectedOption: null,
    };
  }

//  handleChange(event) {
//    const selectedOption = event.target.selectedOption;
//    this.setState(
//      { selectedOption },
//      () => console.log(`Option selected:`, this.state.selectedOption)
//    );
//  };
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => console.log(`Option selected:`, this.state.selectedOption)
    );
  };

  render() {
    const { active, label, name, selectedOption } = this.state;
    const { predicted, locked } = this.props;
    const fieldClassName = `field ${(locked ? active : active || selectedOption) &&
      "active"} ${locked && !active && "locked"}`;

    const options = [
      { value: 'RequestBallot', label: 'Request an Application for Ballot by Mail' },
      { value: 'FindMyReps', label: 'Find my representatives' },
    ];

    return (
      <div className={fieldClassName}>
        {active &&
          selectedOption &&
          predicted &&
          predicted.includes(selectedOption) && <p className="predicted">{predicted}</p>}
        <Select
          id={1}
          name={name}
          type="text"
          value={selectedOption}
          placeholder={label}
          onChange={this.handleChange.bind(this)}
          onFocus={() => !locked && this.setState({ active: true })}
          onBlur={() => !locked && this.setState({ active: false })}
          options={options}
        />
      </div>
    );
  }
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
  //const excelToJson = require('convert-excel-to-json');
  //const result = excelToJson({
  //  sourceFile: '/src/election-duties-1.xlsx'
  //});
  //console.log(result);
}

async function getCivicInfo(voter_info) {
  const url_fname = encodeURIComponent(voter_info.fname);
  const url_lname = encodeURIComponent(voter_info.lname);
  const url_street = encodeURIComponent(voter_info.street);
  const url_city = encodeURIComponent(voter_info.city);
  const url_zip = encodeURIComponent(voter_info.zip);
  //const civic_api_request = 'https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDATZ2arFUsfIjTF8CkufwKdUjH7fM5eVg&address=' + url_street + '%20' + url_city + '%20' + voter_info.state + '&electionId=2000'; 
  const civic_api_request = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDATZ2arFUsfIjTF8CkufwKdUjH7fM5eVg&address=' + url_street + '%20' + url_city + '%20' + voter_info.state + '&electionId=2000'; 
  console.log('Get Civic Info');
  console.log(civic_api_request);
  const civic_info = await fetch(civic_api_request).then(res => res.json()).catch(error => console.error('Error:', error)).then(function(response) {
    console.log('Success');
    return response;
  });
  console.log('Info:',civic_info); 
  return civic_info.state[0].local_jurisdiction.name;
}

async function getVoterInfo(voterData) {
  const data = await fetch('https://teamrv-mvp.sos.texas.gov/MVP/voterDetails.do', 
    { method: 'POST', 
      mode: 'no-cors', 
      redirect: 'follow',
      body: JSON.stringify(voterData),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json()).catch(error => console.error('Error:', error)).then(response => console.log('Success:',response));
}

class VoterForm extends React.Component {
  constructor(props) {
    super(props);

    this.voter_info = {
      selType: 'lfcd',
      fname: '',
      lname: '',
      street: '',
      city: '',
      state: 'TX',
      county: '',
      dob: '',
      zip: ''
    };

    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    //{importCountyElectionInformation()};
//    fetch('https://www.googleapis.com/civicinfo/v2/voterinfo?key=AIzaSyDATZ2arFUsfIjTF8CkufwKdUjH7fM5eVg&address=1300%20Newning%20Ave.%20Austin%20TX&electionId=2000').then(function(response) {
//      return response.json(); 
//    }).then(function(j) {
//      console.log(j);
//      console.log(j.normalizedInput.line1 + ' ' + j.normalizedInput.city + ', ' + j.normalizedInput.state); 
//      console.log(j.state[0].local_jurisdiction.name);
//    }).catch(console.log);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    this.voter_info.fname = data.get('fname');
    this.voter_info.fname = data.get('lname');
    this.voter_info.street = data.get('street');
    this.voter_info.city = data.get('city');
    this.voter_info.zip = data.get('zip');

    this.voter_info.county = getCivicInfo(this.voter_info);
    console.log('County:',this.voter_info.county);
    const voterData = {selType: 'lfcd',firstName: this.voter_info.fname, lastName: this.voter_info.lname, county: this.voter_info.county, dob: '11/19/1989', adZip5: this.voter_info.zip};
    getVoterInfo(voterData);
///      }).then(function(response) {
///        
///        return response.json();
///      }).then(function(sos_data) {
///        console.log(sos_data);
///      }).catch(console.log);
//    var str = "mailto:dana.debeauvoir@traviscountytx.gov?subject=Request for Application for Ballot by Mail&body=";
//    str += "I am writing this email to request to request an application for ballot by mail for the upcoming election.%0D%0A%0D%0A";
//    str += "My name is " + fname + " " + lname + " and my home address is:%0D%0A";
//    str += street + "%0D%0A" + city + ", TX " + zip + "%0D%0A%0D%0A";
//    str += "Thank you very much,%0D%0A" + fname + " " + lname + "%0D%0A";
//    window.open(str, "_blank");
  }
  

  render() {
    return (
      <div>
        <div className="Header">
          <Header />
        </div>
        <div className="Form">
        <form onSubmit={this.handleSubmit} method="get" encType="text/plain">
          <SelectInput label="What do you want to do?" name="select"/>
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
