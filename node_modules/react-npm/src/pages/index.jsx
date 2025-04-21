import React, { PureComponent as Component } from 'react';
import Example from '../model_component';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        Edit this page and
        <Example />
      </div>
    );
  }
}
