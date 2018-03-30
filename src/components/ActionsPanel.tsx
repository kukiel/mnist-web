import * as React from 'react';

interface ActionsPanelProps {
  clear(): void;
  predict(type: string): void;
}

interface ActionsPanelState {
  type: string;
}

export class ActionsPanel extends React.Component<ActionsPanelProps, ActionsPanelState> {
  constructor(props) {
    super(props);
    this.state = {type: 'dense'};
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <button onClick={() => this.props.predict(this.state.type)}>Predict</button>
        <button onClick={() => this.props.clear()}>Clear</button>
        <select name="type" onChange={this.handleChange}>
          <option value="dense">Dense Layers</option>
          <option value="conv">Convolutional Layers</option>
        </select>
      </div>
    );
  }
}
