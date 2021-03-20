import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from 'src/components/Page';
import { Grid, Fab, Container, Box, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { apiGetUserDetail } from 'src/services/user';
import { useSelector, useDispatch } from 'react-redux';
import CustomTooltip from 'src/components/CustomTooltip';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import apiUrl from 'src/utils/apiUrl';
import UserDetailProfile from './UserDetailProfile';
import UserDetailMenuAccess from './UserDetailMenuAccess';
import UserDetailLogs from './UserDetailLogs';

// Style
const useStyle = makeStyles(theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  avatar: {
    border: `10px solid ${theme.palette.background.paper}`,
    width: theme.spacing(60),
    height: theme.spacing(60),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(50),
      height: theme.spacing(50)
    },
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(30),
      height: theme.spacing(30)
    }
  }
}));

/**
 * Komponen utama
 */
function UserDetail(props) {
  const classes = useStyle();
  const navigate = useNavigate();
  const { id } = useParams();
  const { userLogin } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  const isMounted = React.useRef(true);
  const [userData, setUserData] = React.useState(null);

  /**
   * Ambil data userLogin dari redux
   * Cek user access
   * Jika user access read === 0 (false) maka alihkan ke halaman forbidden
   */
  React.useEffect(() => {
    if (userLogin !== null) {
      userLogin.menu_sub_items.filter(
        value =>
          Boolean(
            value.menu_s_i_url === '/users' && value.pivot.user_m_s_i_read !== 1
          ) && navigate('/error/forbidden')
      );
    }
  }, [userLogin, navigate]);

  const handleShowToast = (show, type, message) => {
    dispatch({
      type: 'SET_TOAST',
      value: {
        show: show,
        type: type,
        message: message
      }
    });
  };

  /**
   * mengambil data user dari api
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    if (userData === null) {
      apiGetUserDetail(id)
        .then(res => {
          if (isMounted.current) {
            setUserData(res.data);
          }
        })
        .catch(err => {
          if (isMounted.current) {
            switch (err.status) {
              case 401:
                window.location.href = '/logout';
                break;

              case 404:
                navigate('/error/notfound');
                break;

              case 403:
                navigate('/error/forbidden');
                break;

              default:
                handleShowToast(
                  true,
                  'error',
                  `(#${err.status}) ${err.data.message}`
                );
                break;
            }
          }
        });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Render Komponen utama
   */
  return (
    <Page pb title="View user details" pageTitle="View user details">
      <Container>
        <Grid
          spacing={3}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md={7} xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar
                alt="Avatar"
                className={classes.avatar}
                src={
                  Boolean(
                    userData !== null &&
                      userData.profile.profile_avatar !== null
                  )
                    ? apiUrl(`/avatar/${userData.profile.profile_avatar}`)
                    : null
                }
              />
            </Box>
          </Grid>

          <Grid item md={5} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <UserDetailProfile data={userData} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <UserDetailMenuAccess
              data={
                userData !== null ? userData.menu_access.menu_sub_items : null
              }
            />
          </Grid>

          <Grid item xs={12}>
            <UserDetailLogs data={userData !== null ? userData.logs : null} />
          </Grid>
        </Grid>
      </Container>

      <div className={classes.fab}>
        <CustomTooltip title="Return to the user page" placement="left">
          <Fab color="secondary" onClick={() => navigate('/users')}>
            <RotateLeftIcon />
          </Fab>
        </CustomTooltip>
      </div>
    </Page>
  );
}

export default UserDetail;
