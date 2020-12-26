import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import Page from 'src/components/Page';
import {
  Grid, Fab
} from '@material-ui/core';
import {
  makeStyles
} from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import UserDetailProfile from './UserDetailProfile';
import { apiGetUserDetail } from 'src/services/user';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import CustomTooltip from 'src/components/CustomTooltip';


// Style
const useStyle = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  }
}));


/**
 * Komponen utama
 */
function UserDetail(props) {
  const classes = useStyle();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isMounted = React.useRef(true);
  const [userData, setUserData] = React.useState(null);


  /**
   * Cek apakah state bernilai null atau tidak & state.update bernilai 1 atau tidak
   * Jika tidak arahkan ke halaman 404
   */
  React.useEffect(() => {
    if (location.state === null || location.state.read !== 1) {
      navigate('/404');
    }
  }, [location.state, navigate]);


  /**
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai 
   * Dan untuk menjalankan fungsi getData() untuk mengambil data user
   */
  React.useEffect((props) => {
    userData === null && getData();
    return () => {
      isMounted.current = false;
    }
    // eslint-disable-next-line
  }, []);


  /**
   * Fungsi untuk mengambil data user dari api
   */
  const getData = async () => {
    try {
      let res = await apiGetUserDetail(id);
      if (isMounted.current) {
        setUserData({
          user: res.data.user,
          profile: res.data.profile,
          menus: res.data.menus
        });
      }
    } catch (err) {
      if (isMounted.current) {
        if (err.status === 401) {
          window.location.href = '/logout'
        } else {
          props.setReduxToast(true, 'error', `(#${err.status}) ${err.statusText}`);
        }
      }
    }
  }


  /**
   * Render Komponen utama
   */
  return (
    <Page
      pb
      title='Detailed User Info'
      pageTitle='Detailed User Info'
    >
      <Grid container spacing={3}>
        <Grid item md={6} xs={12}>
          <UserDetailProfile data={userData === null ? null : userData.profile} />
        </Grid>
      </Grid>

      <div className={classes.fab}>
        <CustomTooltip
          title='Return to the user page'
          placement='left'
        >
          <Fab
            color='secondary'
            arial-label='Return to the user page'
            disabled={false}
            onClick={() => {
              navigate('/user', { state: location.state });
            }}
          >
            <RotateLeftIcon />
          </Fab>
        </CustomTooltip>
      </div>
    </Page>
  );
}


/**
 * Redux dispatch
 * @param {obj} dispatch 
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (
      show = false,
      type = 'success',
      message = ''
    ) => dispatch({
      type: reduxAction.toast,
      value: {
        show: show,
        type: type,
        message: message
      }
    }),
  }
}


export default connect(null, reduxDispatch)(UserDetail);