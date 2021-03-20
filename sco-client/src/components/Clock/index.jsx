import React from 'react';
import { Chip } from '@material-ui/core';

function Clock(props) {
  const [date, setDate] = React.useState(new Date());

  React.useEffect(() => {
    let timerID = setInterval(() => {
      tick();
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  const tick = () => {
    setDate(new Date());
  };

  return (
    <Chip
      color="default"
      variant="outlined"
      label={date.toLocaleString()}
      {...props}
    />
  );
}

export default Clock;
