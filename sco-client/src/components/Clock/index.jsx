import React from 'react';
import { Chip } from '@material-ui/core';
import moment from 'moment';

function Clock(props) {
  return (
    <Chip
      color="default"
      variant="outlined"
      label={moment().format('llll')}
      {...props}
    />
  );
}

export default Clock;
