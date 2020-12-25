import React, {
  useEffect,
} from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import Page from 'src/components/Page';
import {
  Grid,
  Fab
} from '@material-ui/core';
import {
  makeStyles
} from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CustomTooltip from 'src/components/CustomTooltip';
import UserEditAccount from './UserEditAccount';
import { connect } from 'react-redux';
import UserEditProfile from './UserEditProfile';


// Style
const useStyle = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  }
}));


// Komponen utama
function UserEdit(props) {
  const classes = useStyle();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();


  /**
   * Cek apakah state bernilai null atau tidak & state.update bernilai 1 atau tidak
   * Jika tidak arahkan ke halaman 404
   */
  useEffect(() => {
    if (location.state === null || location.state.update !== 1) {
      navigate('/404');
    }
  }, [location.state, navigate]);


  /**
   * Render komponent utama
   */
  return (
    <Page
      title='Edit User Profile'
      pageTitle='Edit User Profile'
      pb={true}
    >
      <Grid container spacing={3} >
        <Grid item xs >
          <UserEditProfile
            userId={id}
          />
        </Grid>

        <Grid item xs={12}>
          {<UserEditAccount userId={id} />}
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
  )
}


/**
 * Redux state
 * @param {obj} state 
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, null)(UserEdit);