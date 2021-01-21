import React from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import WorkIcon from '@material-ui/icons/Work';
import MailIcon from '@material-ui/icons/Mail';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import {
  makeStyles
} from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Box,
  Grid,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import apiUrl from 'src/utils/apiUrl';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  avatar: {
    width: theme.spacing(30),
    height: theme.spacing(30),
  },
}));


/**
 * Komponen utama
 */
function UserDetailProfile({ data, ...props }) {
  const isMounted = React.useRef(true);
  const classes = useStyles();


  /**
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai 
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  /**
   * Render Komponen utama
   */
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box
          display='flex'
          justifyContent='center'
        >
          {data === null
            ? (
              <Skeleton variant='circle' className={classes.avatar} />
            ) : (
              <Avatar
                alt='Avatar'
                className={classes.avatar}
                src={
                  data.profile_avatar === null
                    ? ''
                    : apiUrl(`/avatar/${data.profile_avatar}`)
                }
              />
            )
          }
        </Box>
      </Grid>

      <Grid item xs={12}>
        <List className={classes.root}>
          <ListItem>
            <ListItemAvatar>
              {
                data === null
                  ? (
                    <Skeleton variant='circle' width={40} height={40} />
                  ) : (
                    <Avatar>
                      <AccountBoxIcon />
                    </Avatar>
                  )
              }
            </ListItemAvatar>

            <ListItemText
              primary={
                data === null
                  ? <Skeleton variant='text' width='50%' />
                  : data.profile_name === null ? "..." : data.profile_name
              }
              secondary={
                data === null
                  ? <Skeleton variant='text' width='30%' />
                  : 'Profile name'
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              {
                data === null
                  ? (
                    <Skeleton variant='circle' width={40} height={40} />
                  ) : (
                    <Avatar>
                      <WorkIcon />
                    </Avatar>
                  )
              }
            </ListItemAvatar>

            <ListItemText
              primary={
                data === null
                  ? <Skeleton variant='text' width='50%' />
                  : data.profile_division === null ? "..." : data.profile_division
              }
              secondary={
                data === null
                  ? <Skeleton variant='text' width='30%' />
                  : 'Division'
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              {
                data === null
                  ? (
                    <Skeleton variant='circle' width={40} height={40} />
                  ) : (
                    <Avatar>
                      <MailIcon />
                    </Avatar>
                  )
              }
            </ListItemAvatar>

            <ListItemText
              primary={
                data === null
                  ? <Skeleton variant='text' width='50%' />
                  : data.profile_email === null ? "..." : data.profile_email
              }
              secondary={
                data === null
                  ? <Skeleton variant='text' width='30%' />
                  : 'Email'
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              {
                data === null
                  ? (
                    <Skeleton variant='circle' width={40} height={40} />
                  ) : (
                    <Avatar>
                      <PhoneAndroidIcon />
                    </Avatar>
                  )
              }
            </ListItemAvatar>

            <ListItemText
              primary={
                data === null
                  ? <Skeleton variant='text' width='50%' />
                  : data.profile_phone === null ? "..." : data.profile_phone
              }
              secondary={
                data === null
                  ? <Skeleton variant='text' width='30%' />
                  : 'Phone'
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemAvatar>
              {
                data === null
                  ? (
                    <Skeleton variant='circle' width={40} height={40} />
                  ) : (
                    <Avatar>
                      <LocationOnIcon />
                    </Avatar>
                  )
              }
            </ListItemAvatar>

            <ListItemText
              primary={
                data === null
                  ? <Skeleton variant='text' width='50%' />
                  : data.profile_address === null ? "..." : data.profile_address
              }
              secondary={
                data === null
                  ? <Skeleton variant='text' width='30%' />
                  : 'Address'
              }
            />
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
}


/**
 * Properti default untuk komponen UserDetailProfile
 */
UserDetailProfile.defaultProps = {
  data: null
};


/**
 * Redux State
 * @param {obj} state 
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, null)(UserDetailProfile);