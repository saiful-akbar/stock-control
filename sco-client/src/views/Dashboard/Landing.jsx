import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundImage: 'url(/static/images/svg/work_tim.svg)',
    width: '100%',
    height: theme.spacing(50),
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    marginBottom: theme.spacing(10),
    transform: 'rotateY(180deg)'
  },
  textBox: {
    transform: 'rotateY(180deg)',
    padding: theme.spacing(3, 3, 15, 3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    textShadow: `0px 0px 3px ${theme.palette.type === 'dark' ? '#000' : '#fff'}`
  }
}));

const Landing = props => {
  const classes = useStyles();

  return (
    <div className={classes.root} {...props}>
      <Box className={classes.textBox}>
        <Typography className={classes.text} variant="h4" color="textPrimary">
          <strong>Dashboard</strong>.
        </Typography>

        <Box mt={3}>
          <Typography
            className={classes.text}
            variant="h5"
            color="textSecondary"
          >
            Welcome to <strong>Stock Control Aplication</strong>
          </Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Landing;
