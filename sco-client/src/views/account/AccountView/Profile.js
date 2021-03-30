import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const user = {
  avatar: '',
  city: 'Kota Tangerang Selatan',
  country: 'Indonesia',
  jobTitle: 'Web Developer',
  name: 'Saiful Akbar',
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
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Box alignItems="center" display="flex" flexDirection="column">
          <Avatar
            className={classes.avatar}
            src={loading ? null : user.avatar}
          />
          {loading ? (
            <React.Fragment>
              <Skeleton width="70%" variant="text" />
              <Skeleton width="50%" variant="text" />
              <Skeleton width="50%" variant="text" />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography color="textPrimary" gutterBottom variant="h6">
                {user.name}
              </Typography>

              <Typography color="textSecondary" variant="body1">
                {`${user.city} ${user.country}`}
              </Typography>

              <Typography
                className={classes.dateText}
                color="textSecondary"
                variant="body1"
              >
                {user.timezone}
              </Typography>
            </React.Fragment>
          )}
        </Box>
      </CardContent>

      <Divider />

      <CardActions>
        <Button color="primary" fullWidth variant="text">
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
