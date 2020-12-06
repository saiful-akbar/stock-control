import React, { Component } from 'react';
import { Chip } from '@material-ui/core';

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => {
      this.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <Chip
        label={this.state.date.toLocaleString()}
        variant='outlined'
        {...this.props}
      />
    );
  }
}

export default Clock;