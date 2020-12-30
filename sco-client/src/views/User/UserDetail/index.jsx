import React from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import Page from 'src/components/Page';
import {
  Grid,
  Fab,
  Typography,
  AccordionDetails,
  AccordionSummary,
  Accordion,
} from '@material-ui/core';
import {
  makeStyles
} from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import UserDetailProfile from './UserDetailProfile';
import { apiGetUserDetail } from 'src/services/user';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CustomTooltip from 'src/components/CustomTooltip';
import UserDetailAccount from './UserDetailAccount';
import { Skeleton } from '@material-ui/lab';
import UserDetailMenu from './UserDetailMenu';


// Style
const useStyle = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
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
  const [expanded, setExpanded] = React.useState('panel1');


  /**
   * Expanded acordion
   * @param {string} panel 
   */
  const handleAccordionChange = (panel) => (e, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };


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
        <Grid
          item
          md={6}
          xs={12}
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
              <AccordionSummary
                expandIcon={
                  userData === null
                    ? <Skeleton variant='circle' width={20} height={20} />
                    : <ExpandMoreIcon />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                {userData === null
                  ? (
                    <Skeleton variant='text' >
                      <Typography className={classes.heading}>{'Account Info'}</Typography>
                    </Skeleton>
                  )
                  : (
                    <Typography className={classes.heading}>{'Account Info'}</Typography>
                  )
                }
              </AccordionSummary>

              <AccordionDetails>
                <UserDetailAccount data={userData === null ? null : userData.user} />
              </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
              <AccordionSummary
                expandIcon={
                  userData === null
                    ? <Skeleton variant='circle' width={20} height={20} />
                    : <ExpandMoreIcon />
                }
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                {userData === null
                  ? (
                    <Skeleton variant='text' >
                      <Typography className={classes.heading}>{'Profile Info'}</Typography>
                    </Skeleton>
                  )
                  : (
                    <Typography className={classes.heading}>{'Profile Info'}</Typography>
                  )
                }
              </AccordionSummary>

              <AccordionDetails>
                <UserDetailProfile data={userData === null ? null : userData.profile} />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Grid item md={6} xs={12}>
          <UserDetailMenu data={userData === null ? null : userData.user} />
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