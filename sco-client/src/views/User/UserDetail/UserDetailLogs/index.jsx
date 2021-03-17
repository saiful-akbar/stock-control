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
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Style
 */
const useStyle = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark
  },
  ip: {
    color: theme.palette.info.main
  }
}));

/**
 * Komponent utama UserDetailLogs
 *
 * @param {Object} param0
 */
function UserDetailLogs({ data }) {
  const classes = useStyle();

  /**
   * Render
   */
  return (
    <Card elevation={0} className={classes.root}>
      <CardHeader title="Recent events" />

      <Divider />

      <CardContent>
        <Box display="flex" justifyContent="center" alignItems="center">
          {data !== null ? (
            data.length > 0 ? (
              <Timeline align="alternate">
                {data.map(log => (
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
              <Typography variant="body1">
                There are no recent events
              </Typography>
            )
          ) : (
            <Typography component="span">Loading...</Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

/**
 * Default props
 */
UserDetailLogs.defaultProps = {
  data: null
};

export default UserDetailLogs;
