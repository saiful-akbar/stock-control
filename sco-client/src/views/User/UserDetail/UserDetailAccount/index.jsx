import React from 'react';
import { connect } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import {
  makeStyles
} from '@material-ui/core/styles';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));


/**
 * Komponen utama
 */
function UserDetailAccount({ data, ...props }) {
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
    <>
      <List className={classes.root}>
        <ListItem>
          <ListItemAvatar>
            {
              data === null
                ? (
                  <Skeleton variant='circle' width={40} height={40} />
                ) : (
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                )
            }
          </ListItemAvatar>

          <ListItemText
            primary={
              data === null
                ? <Skeleton variant='text' width='50%' />
                : data.username === null ? "..." : data.username
            }
            secondary={
              data === null
                ? <Skeleton variant='text' width='30%' />
                : 'Username'
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
                    <LockIcon />
                  </Avatar>
                )
            }
          </ListItemAvatar>

          <ListItemText
            primary={
              data === null
                ? <Skeleton variant='text' width='50%' />
                : "*********"
            }
            secondary={
              data === null
                ? <Skeleton variant='text' width='30%' />
                : 'Password'
            }
          />
        </ListItem>
      </List>
    </>
  );
}


/**
 * Properti default untuk komponen UserDetailAccount
 */
UserDetailAccount.defaultProps = {
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


export default connect(reduxState, null)(UserDetailAccount);