import React from 'react';
import { Grid, Avatar, Typography } from '@material-ui/core';
import apiUrl from 'src/apiUrl';
import { makeStyles } from '@material-ui/core/styles';

/**
 * Style
 */
const useStyle = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));


/**
 * Komponen utama
 * @param {*} props 
 */
function UserProfile(props) {
  const classes = useStyle();
  const { data } = props;


  /**
   * Render komponen utama
   */
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
          src={
            data && data.profile_avatar
              ? apiUrl(`/avatar/${data.profile_avatar}`)
              : ''
          }
        />
      </Grid>

      <Grid item xs zeroMinWidth>
        <Typography
          color='textPrimary'
          variant='subtitle1'
          noWrap
        >
          {
            data && data.profile_name
              ? data.profile_name
              : 'Username does not exist!'
          }
        </Typography>
        <Typography
          color='textSecondary'
          variant='body2'
          noWrap
        >
          {
            data && data.profile_division
              ? data.profile_division
              : 'Division does not exist!'
          }
        </Typography>
      </Grid>
    </Grid>
  );
};

export default UserProfile;