import React from 'react';
import { Chip } from '@material-ui/core';
import moment from 'moment';

function Clock(props) {
  const [date, setDate] = React.useState(moment().format('llll'));

  React.useEffect(() => {
    let timerID = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const tick = () => {
    setDate(moment().format('llll'));
  };

  return <Chip color="default" variant="outlined" label={date} {...props} />;
}

export default Clock;
