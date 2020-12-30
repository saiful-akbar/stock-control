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
  Card,
  CardHeader,
  CardContent,
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
function UserDetailMenus({ data, ...props }) {
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
    <Card
      elevation={3}
      variant={
        props.reduxTheme === 'dark'
          ? 'outlined'
          : 'elevation'
      }
    >
      <CardHeader
        title={
          data === null
            ? <Skeleton variant='text' width={120} />
            : 'Menu Access'
        }
      />

      <CardContent>

      </CardContent>
    </Card>
  );
}


/**
 * Properti default untuk komponen UserDetailMenus
 */
UserDetailMenus.defaultProps = {
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


export default connect(reduxState, null)(UserDetailMenus);