import React from 'react';
import Page from 'src/components/Page';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import CustomTooltip from 'src/components/CustomTooltip';
import { Fab, Box } from '@material-ui/core';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import UserCreateAccountProfile from './UserCreateAccountProfile';
import { apiGetDataUserCreate } from 'src/services/user';
import { reduxAction } from 'src/config/redux/state';
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
  const [steps] = React.useState(['Account & Profile', 'Menu Access']);
  const [activeStep, setActiveStep] = React.useState(1);
  const [dataMenus, setDataMenus] = React.useState(null);

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
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.filter(
        value =>
          Boolean(
            value.menu_s_i_url === '/users' &&
              value.pivot.user_m_s_i_create !== 1
          ) && navigate('/error/forbidden')
      );
    }
  }, [props.reduxUserLogin, navigate]);

  /* Mengambil data menus pada server dari api */
  React.useState(() => {
    if (dataMenus === null) {
      apiGetDataUserCreate()
        .then(res => {
          if (isMounted.current) {
            setDataMenus(res.data);
          }
        })
        .catch(err => {
          if (isMounted.current) {
            props.setReduxToast(
              true,
              'error',
              `(#${err.status}) ${err.data.message}`
            );
          }
        });
    }
  }, [dataMenus]);

  /* Fungsi next step */
  const handleNext = () => {
    setActiveStep(1);
  };

  /* Fungsi back step */
  const handleBack = () => {
    setActiveStep(0);
  };

  /* FUngsi untuk merender conten step */
  const getStepContent = stepIndex => {
    switch (stepIndex) {
      case 1:
        return <UserCreateMenuAccess dataMenus={dataMenus} />;
      default:
        return (
          <UserCreateAccountProfile
            dataMenus={dataMenus}
            onNextStep={() => handleNext()}
            onBackStep={() => handleBack()}
          />
        );
    }
  };

  /* Render */
  return (
    <Page title="Create User" pageTitle="Create New User" pb={true}>
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
    </Page>
  );
}

/* Redux State */
function reduxState(state) {
  return {
    reduxUserLogin: state.userLogin
  };
}

/* redux reducer */
function reduxReducer(dispatch) {
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

export default connect(reduxState, reduxReducer)(UserCreate);
