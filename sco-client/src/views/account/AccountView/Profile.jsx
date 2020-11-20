import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7'
};

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={loading ? null : user.avatar}
          />
          {loading ? (
            <>
              <Skeleton width="70%">
                <Typography variant="h3">.</Typography>
              </Skeleton>
              <Skeleton width="50%">
                <Typography variant="body1">.</Typography>
              </Skeleton>
              <Skeleton width="50%">
                <Typography variant="body1">.</Typography>
              </Skeleton>
            </>
          ) : (
            <>
              <Typography color="textPrimary" gutterBottom variant="h3">
                {user.name}
              </Typography>
              <Typography color="textSecondary" variant="body1">
                {`${user.city} ${user.country}`}
              </Typography>

              <Typography className={classes.dateText} color="textSecondary" variant="body1">
                {`${moment().format('hh:mm A')} ${user.timezone}`}
              </Typography>
            </>
          )}

        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          color="primary"
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
