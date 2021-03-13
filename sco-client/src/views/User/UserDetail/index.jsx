import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Page from 'src/components/Page';
import { Grid, Fab, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { apiGetUserDetail } from 'src/services/user';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import CustomTooltip from 'src/components/CustomTooltip';

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
  }
}));

/**
 * Komponen utama
 */
function UserDetail(props) {
  const classes = useStyle();
  const navigate = useNavigate();
  const { id } = useParams();

  const isMounted = React.useRef(true);

  const [userData, setUserData] = React.useState(null);

  /**
   * Ambil data userLogin dari redux
   * Cek user access
   * Jika user access read === 0 (false) maka alihkan ke halaman forbidden
   */
  React.useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.filter(
        value =>
          Boolean(
            value.menu_s_i_url === '/users' && value.pivot.user_m_s_i_read !== 1
          ) && navigate('/error/forbidden')
      );
    }
  }, [props.reduxUserLogin, navigate]);

  /**
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai
   * Dan untuk menjalankan fungsi getData() untuk mengambil data user
   */
  React.useEffect(props => {
    userData === null && getData();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi untuk mengambil data user dari api
   */
  const getData = () => {
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
              props.setReduxToast(
                true,
                'error',
                `(#${err.status}) ${err.data.message}`
              );
              break;
          }
        }
      });
  };

  /**
   * Render Komponen utama
   */
  return (
    <Page pb title="View user details" pageTitle="View user details">
      <Container maxWidth="md">
        <Grid spacing={3} container>
          <Grid item md={12} xs={12}>
            <Typography color="textPrimary">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Non at
              ducimus suscipit quasi amet excepturi sint repudiandae vel? Minus
              tenetur facere aspernatur sapiente. Repudiandae harum vitae iusto
              dolorum eveniet nihil?
            </Typography>
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

/**
 * Redux dispatch
 * @param {obj} dispatch
 */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: reduxAction.toast,
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

/* Redux State */
function reduxState(state) {
  return {
    reduxUserLogin: state.userLogin
  };
}

export default connect(reduxState, reduxDispatch)(UserDetail);
