import React from 'react';
import logo from './texas_imprint.png';
import './voterForm.css';
import './Logo.css';

console.log(logo);

function Header() {
  return <img src={logo} alt="Logo" class="center"/>;
}

class TextInput extends React.Component {
constructor(props) {
    super(props);

    this.state = {
      active: (props.locked && props.active) || false,
      value: props.value || "",
      error: props.error || "",
      label: props.label || "Label"
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
    const { active, value, error, label } = this.state;
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

class VoterForm extends React.Component {
  render() {
    return (
      <div className="App">
        <div className="Header">
          <Header />
        </div>
        <div className="Form">
        <form>
          <TextInput label="First Name" />
          <TextInput label="Last Name" />
          <TextInput label="Street" />
          <TextInput label="City" />
          <TextInput label="Zip Code" />
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
