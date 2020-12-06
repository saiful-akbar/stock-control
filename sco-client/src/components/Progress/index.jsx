import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, LinearProgress } from '@material-ui/core';

const Progress = ({ show, type, color, ...props }) => {


  const circular = () => {
    if (show) {
      return (
        <CircularProgress color={color} {...props} />
      )
    } else {
      return <div />;
    }
  };


  const linear = () => {
    if (show) {
      return (
        <LinearProgress color={color} {...props} />
      )
    } else {
      return <div style={{ height: 4 }} {...props} />;
    }
  }

  return type === 'linear' ? linear() : circular();
};

Progress.defaultProps = {
  show: false,
  type: 'linear',
  color: 'primary'
};

Progress.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
  color: PropTypes.string,
};

export default Progress;