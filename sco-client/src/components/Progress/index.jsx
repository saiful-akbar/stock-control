import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, LinearProgress } from '@material-ui/core';

const Progress = ({ show, type, ...props }) => {


  const circular = () => {
    if (show) {
      return <CircularProgress {...props} />;
    } else {
      return <div />;
    }
  };


  const linear = () => {
    if (show) {
      return <LinearProgress {...props} />;
    } else {
      return <div style={{ height: 4 }} {...props} />;
    }
  }

  return type === 'linear' ? linear() : circular();
};

Progress.defaultProps = {
  show: false,
  type: 'linear',
};

Progress.propTypes = {
  show: PropTypes.bool,
  type: PropTypes.string,
};

export default Progress;