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
import { Skeleton } from '@material-ui/lab';

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
    width: theme.spacing(50),
    height: theme.spacing(50),
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
  const isMounted = React.useRef(true);
  const navigate = useNavigate();
  const { id } = useParams();

  /**
   * Redux
   */
  const { userLogin } = useSelector(state => state.authReducer);
  const { account, profile } = useSelector(
    state => state.usersReducer.userDetail
  );
  const dispatch = useDispatch();

  /**
   * State
   */
  const [isSkeletonShow, setSkeletonShow] = React.useState(false);

  /**
   * Ambil data userLogin dari redux
   * Cek user access
   * Jika user access read === 0 (false) maka alihkan ke halaman forbidden
   */
  React.useEffect(() => {
    if (userLogin.menuSubItems !== null) {
      userLogin.menuSubItems.filter(
        value =>
          Boolean(value.menu_s_i_url === '/users' && value.pivot.read !== 1) &&
          navigate('/error/forbidden')
      );
    }
  }, [userLogin, navigate]);

  /**
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /**
   * mengambil data user dari api jika param id !== redux userDetail.account.id
   */
  React.useEffect(() => {
    if (id !== account.id) {
      setSkeletonShow(true);
      dispatch(apiGetUserDetail(id))
        .then(() => {
          if (isMounted.current) setSkeletonShow(false);
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
                setSkeletonShow(false);
                break;
            }
          }
        });
    }
  }, [dispatch, id, account, setSkeletonShow, navigate]);

  /**
   * Render Komponen utama
   */
  return (
    <Page pb title="View user details" pageTitle="View user details">
      <Container maxWidth="md">
        <Grid
          spacing={5}
          container
          direction="row"
          justify="center"
          alignItems="center"
        >
          <Grid item md={6} xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <UserDetailProfile isSkeletonShow={isSkeletonShow} />
              </Grid>
            </Grid>
          </Grid>

          <Grid item md={6} xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center">
              {isSkeletonShow ? (
                <Skeleton variant="circle" className={classes.avatar} />
              ) : (
                <Avatar
                  alt="Avatar"
                  className={classes.avatar}
                  src={
                    profile.avatar === null
                      ? ''
                      : apiUrl(`/avatar/${profile.avatar}`)
                  }
                />
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <UserDetailMenuAccess isSkeletonShow={isSkeletonShow} />
          </Grid>

          <Grid item xs={12}>
            <UserDetailLogs isSkeletonShow={isSkeletonShow} />
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
