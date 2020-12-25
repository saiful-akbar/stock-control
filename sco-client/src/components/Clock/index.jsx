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
        color='default'
        variant='outlined'
        label={this.state.date.toLocaleString()}
        {...this.props}
      />
    );
  }
}

export default Clock;