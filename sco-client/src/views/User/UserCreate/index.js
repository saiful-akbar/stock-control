import React from 'react';
import Page from 'src/components/Page';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CustomTooltip from 'src/components/CustomTooltip';
import { Fab, Box, Container } from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import UserCreateAccountProfile from './UserCreateAccountProfile';
import { apiGetDataUserCreate } from 'src/services/user';
import UserCreateMenuAccess from './UserCreateMenuAccess';

/* Style */
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.appBar + 1
  }
}));

/* Komponent utama */
function UserCreate(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const isMounted = React.useRef(true);

  /**
   * State
   */
  const [steps] = React.useState(['Account & Profile', 'Menu Access']);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isSkeletonShow, setSkeletonShow] = React.useState(false);
  const [userId, setUserId] = React.useState(null);

  /**
   * Redux
   */
  const { userLogin } = useSelector(state => state.authReducer);
  const { menuItems, menuSubItems } = useSelector(state => state.menusReducer);
  const dispatch = useDispatch();

  /* Merubah maunted menjadi false ketika komponen dilepas */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disble-next-line
  }, []);

  /**
   * Ambil data userLogin dari redux
   * Cek user access
   * Jika user access create === 0 (false) maka alihkan ke halaman forbidden
   */
  React.useEffect(() => {
    userLogin.menuSubItems.filter(value => {
      if (value.menu_s_i_url === '/users' && value.pivot.create !== 1) {
        return navigate('/error/forbidden');
      }
      return null;
    });
  }, [userLogin, navigate]);

  /**
   * Mengambil data menus pada server dari api
   */
  React.useState(() => {
    if (menuItems.data === null || menuSubItems.data === null) {
      setSkeletonShow(true);
      dispatch(apiGetDataUserCreate())
        .then(() => {
          if (isMounted.current) setSkeletonShow(false);
        })
        .catch(err => {
          if (isMounted.current) {
            switch (err.status) {
              case 401:
                window.location.href = '/logout';
                break;

              case 403:
                navigate('/error/forbidden');
                break;

              case 404:
                navigate('/error/notfound');
                break;

              default:
                setSkeletonShow(false);
                break;
            }
          }
        });
    }
  }, [menuItems, menuSubItems, setSkeletonShow, navigate]);

  /* Fungsi next step */
  const handleNextStep = () => {
    setActiveStep(1);
  };

  /* Fungsi next step */
  const handleBackStep = () => {
    setActiveStep(0);
  };

  /* FUngsi untuk merender conten step */
  const getStepContent = stepIndex => {
    switch (stepIndex) {
      case 1:
        return (
          <UserCreateMenuAccess
            isSkeletonShow={isSkeletonShow}
            userId={userId}
            onBackStep={() => handleBackStep()}
          />
        );
      default:
        return (
          <UserCreateAccountProfile
            isSkeletonShow={isSkeletonShow}
            onChangeUserId={id => setUserId(id)}
            onNextStep={() => handleNextStep()}
          />
        );
    }
  };

  /* Render */
  return (
    <Page title="Create User" pageTitle="Create New User" pb={true}>
      <Container>
        <div className={classes.root}>
          <Stepper activeStep={activeStep} alternativeLabel elevation={3}>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div id="step-content">
            <Box mt={3}>{getStepContent(activeStep)}</Box>
          </div>
        </div>

        <div className={classes.fab}>
          <CustomTooltip title="Return to the user page" placement="left">
            <Fab color="secondary" onClick={() => navigate('/users')}>
              <RotateLeftIcon />
            </Fab>
          </CustomTooltip>
        </div>
      </Container>
    </Page>
  );
}

export default UserCreate;
