import React from 'react';
import { Grid, Avatar, Typography } from '@material-ui/core';
import apiUrl from 'src/apiUrl';
import { makeStyles } from '@material-ui/core/styles';
import MailIcon from '@material-ui/icons/Mail';


const useStyle = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));


const UserProfile = (props) => {
  const classes = useStyle();
  const { profile } = props.data;

  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      spacing={3}
    >
      <Grid item>
        <Avatar
          className={classes.avatar}
          alt='Avatar'
          src={profile.profile_avatar ? apiUrl(`/avatar/${profile.profile_avatar}`) : ''}
        />
      </Grid>

      <Grid item xs zeroMinWidth>
        <Typography
          color='textPrimary'
          variant='subtitle1'
          noWrap
        >
          {profile.profile_name}
        </Typography>
        <Typography
          color='textSecondary'
          variant='body2'
          noWrap
        >
          {profile.profile_division}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UserProfile;