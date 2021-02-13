import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineOppositeContent from '@material-ui/lab/TimelineOppositeContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import DesktopWindowsIcon from '@material-ui/icons/DesktopWindows';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Box, Divider } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

/* Komponent untuk menentukan tipe icon berdasarkan browser yang digunakan */
function isDevice(type = null) {
  if (
    type === 'Android' ||
    type === 'iPhone' ||
    type === 'iPad' ||
    type === 'Windows Phone'
  ) {
    return <PhoneAndroidIcon />;
  } else {
    return <DesktopWindowsIcon />;
  }
}

/* Style */
const useStyles = makeStyles(theme => ({
  paper: {
    padding: '6px 16px'
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main
  }
}));

/* Komponen utama */
function UserSeesion({ data, ...props }) {
  const classes = useStyles();

  /* Render */
  return (
    <React.Fragment>
      <Box pb={2}>
        {data === null ? (
          <Skeleton variant="text">
            <Typography variant="h5" color="textPrimary">
              {'Session'}
            </Typography>
          </Skeleton>
        ) : (
          <Typography variant="h5" color="textPrimary">
            {'Session'}
          </Typography>
        )}
      </Box>

      <Divider />

      <Timeline align="alternate">
        {data !== null &&
          data.map(dt => {
            return (
              <TimelineItem key={dt.id}>
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {dt.logged_at}
                  </Typography>
                </TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot color="secondary" variant="default">
                    {isDevice(dt.device)}
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>

                <TimelineContent>
                  <Paper
                    elevation={3}
                    className={classes.paper}
                    variant={
                      props.reduxTheme === 'dark' ? 'outlined' : 'elevation'
                    }
                  >
                    <Typography variant="h6">{dt.ip2}</Typography>
                    <Typography variant="body1">{`${dt.browser} on ${dt.device}`}</Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            );
          })}
      </Timeline>
    </React.Fragment>
  );
}

/* Properti default untuk komponen UserDetailAccount */
UserSeesion.defaultProps = {
  data: null
};

/* redux State */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  };
}

export default connect(reduxState, null)(UserSeesion);
