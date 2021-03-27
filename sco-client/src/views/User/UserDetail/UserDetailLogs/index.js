import React from 'react';
import Timeline from '@material-ui/lab/Timeline';
import TimelineItem from '@material-ui/lab/TimelineItem';
import TimelineSeparator from '@material-ui/lab/TimelineSeparator';
import TimelineConnector from '@material-ui/lab/TimelineConnector';
import TimelineContent from '@material-ui/lab/TimelineContent';
import TimelineDot from '@material-ui/lab/TimelineDot';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Box,
  Typography,
  Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import notesImage from 'src/assets/images/svg/notes.svg';

/**
 * Style
 */
const useStyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark
  },
  ip: {
    color: theme.palette.info.main
  },
  image: {
    backgroundImage: `url(${notesImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%',
    height: 150,
    [theme.breakpoints.down('sm')]: {
      height: 100
    }
  }
}));

/**
 * Komponent utama UserDetailLogs
 *
 * @param {Object} param0
 */
function UserDetailLogs({ isSkeletonShow }) {
  const classes = useStyle();

  /**
   * Redux
   */
  const { logs } = useSelector(state => state.usersReducer.userDetail);

  /**
   * Render
   */
  return (
    <Box mt={5}>
      <Grid
        container
        spacing={5}
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item md={6} xs={8}>
          <Typography variant="h5" color="textPrimary" noWrap>
            {'Recent events'}
          </Typography>

          <Typography variant="subtitle2" color="textSecondary">
            {'A list of the last 50 user activities'}
          </Typography>
        </Grid>

        <Grid item md={6} xs={4} className={classes.image} />

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" alignItems="center">
            {isSkeletonShow ? (
              <Typography component="span" color="textPrimary">
                Loading...
              </Typography>
            ) : logs.length > 0 ? (
              <Timeline align="alternate">
                {logs.map(log => (
                  <TimelineItem key={log.id}>
                    <TimelineSeparator>
                      <TimelineDot color="primary" />
                      <TimelineConnector />
                    </TimelineSeparator>

                    <TimelineContent>
                      <Card elevation={3}>
                        <CardHeader
                          subheader={`From ${log.browser} on ${log.device}`}
                        />

                        <CardContent>
                          <Typography>{log.log_desc}</Typography>
                        </CardContent>

                        <Divider />

                        <Box p={2}>
                          <Typography component="div">
                            <span className={classes.ip}>{log.ip}</span> |{' '}
                            {log.created_at}
                          </Typography>
                        </Box>
                      </Card>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Typography variant="body1" color="textPrimary">
                There are no recent events
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

/**
 * Default props
 */
UserDetailLogs.defaultProps = {
  isSkeletonShow: false
};

export default UserDetailLogs;
