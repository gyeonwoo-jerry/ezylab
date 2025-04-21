// Just copy and paste this folder again and again to start your own components
import React, { PureComponent as Component } from 'react';
import PropTypes from 'prop-types';
import './style.sass';

export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="my-component-unique-class">
        {this.props.children}
      </div>
    );
  }
}

//Component Documentation
Example.propTypes = {
  children: PropTypes.node.isRequired,
}
