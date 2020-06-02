import React from 'react';
import Select from 'react-select';
import logo from './texas_imprint.png';
import noImage from './no-image-available2.png';
import './voterForm.css';
import './Logo.css';

console.log(logo);
console.log(noImage);

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

class Official extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      name:  props.name || '',
      party: props.party || '',
      office: props.office || '',
      twitterHandle: props.twitterHandle || '',
      photoUrl: props.photoUrl || '',
    };
    
    this.getTwitterHandleString = this.getTwitterHandleString.bind(this);
  }

  getTwitterHandleString() {
    var string = '';
    string = this.twitterHandle?', @'+this.twitterHandle:'';
    return string
  }

  render() {
    const { name, party, office, twitterHandle, photoUrl } = this.state;
    return (
      <div class="official" name={name} id={name}>
        <div class="official_left">
          <img src={photoUrl} class="official_image"/>
        </div>
        <div class="official_right">
          <h4>{name}</h4>
          <div class="official_details">{office}, {party}{this.getTwitterHandleString}</div>
        </div>
      </div>
    );
  }
}

function getTwitterHandle(channels) {
  var id = '';
  if (channels) {
  const accounts = new Array(channels);
    accounts.forEach(account => {
      account.forEach(a => {
        if(a.type === 'Twitter'){
          id = a.id;
        }
      });
    });
  }
  return id;
}

class VoterForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show_info: false,
      divisions: [],
      normalizedInput: [],
      offices: [],
      officials: [],
    };

    this.voter_info = {
      selType: 'lfcd',
      fname: '',
      lname: '',
      street: '',
      city: '',
      state: 'TX',
      county: '',
      dob: '',
      zip: '',
    };

    this.handleBack = this.handleBack.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCivicInfo = this.getCivicInfo.bind(this);
  }

  getCivicInfo() {
    const url_street = encodeURIComponent(this.voter_info.street);
    const url_city = encodeURIComponent(this.voter_info.city);
    const civic_api_request = 'https://www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyDATZ2arFUsfIjTF8CkufwKdUjH7fM5eVg&address=' + url_street + '%20' + url_city + '%20' + this.voter_info.state + '&electionId=2000'; 
    console.log('Get Civic Info');
    console.log(civic_api_request);
    fetch(civic_api_request).then(res => res.json()).catch(error => console.error('Error:', error)).then(response => { 
    console.log('Success', response);
    this.setState({ divisions: response.divisions });
    this.setState({ normalizedInput: response.normalizedInput });
    this.setState({ offices: response.offices });
    this.setState({ officials: response.officials });
    return response; 
    });
  }

  handleBack(event) {
    event.preventDefault();
    this.setState({ show_info: false });
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    this.voter_info.select = data.get('select');
    this.voter_info.fname = data.get('fname');
    this.voter_info.fname = data.get('lname');
    this.voter_info.street = data.get('street');
    this.voter_info.city = data.get('city');
    this.voter_info.zip = data.get('zip');
    this.setState({ show_info: true });

    this.getCivicInfo();
//    var str = "mailto:dana.debeauvoir@traviscountytx.gov?subject=Request for Application for Ballot by Mail&body=";
//    str += "I am writing this email to request to request an application for ballot by mail for the upcoming election.%0D%0A%0D%0A";
//    str += "My name is " + fname + " " + lname + " and my home address is:%0D%0A";
//    str += street + "%0D%0A" + city + ", TX " + zip + "%0D%0A%0D%0A";
//    str += "Thank you very much,%0D%0A" + fname + " " + lname + "%0D%0A";
//    window.open(str, "_blank");
  }
  
  render() {
    if(this.state.show_info === true && this.state.officials.length>0) {
      const { show_info, divisions, normalizedInput, offices, officials} = this.state;
      return (
        <div>
          <div className="Header">
            <Header />
          </div>
          <div className="field">
            <input type="submit" onClick={this.handleBack} value="Back" />
          </div>
          <div className="officials">
            {offices.map(office =>
            <Official   name={officials[office.officialIndices[0]].name} 
                        party={officials[office.officialIndices[0]].party} 
                        office={office.name} 
                        twitterHandle={getTwitterHandle(officials[office.officialIndices[0]].channels)} 
                        photoUrl={officials[office.officialIndices[0]].photoUrl?officials[office.officialIndices[0]].photoUrl:noImage}  
              />
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="Header">
            <Header />
          </div>
          <div className="Form">
          <form onSubmit={this.handleSubmit} method="get" encType="text/plain">
            <SelectInput label="What do you want to do?" name="select"/>
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
}

export default VoterForm;
