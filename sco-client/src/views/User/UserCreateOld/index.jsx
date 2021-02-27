import React, { useEffect, useState, useRef } from 'react';
import Page from 'src/components/Page';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import { useNavigate } from 'react-router-dom';
import CustomTooltip from 'src/components/CustomTooltip';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Stepper, Step, StepLabel, Fab, Card } from '@material-ui/core';
import UserForm from './UserForm';
import ProfileForm from './ProfileForm';
import AddMenuItems from './AddMenuItems';
import AddMenuSubItems from './AddMenuSubItems';
import {
  apiGetAllMenus,
  apiCreateUser,
  apiCreateUserMenuAccess
} from 'src/services/user';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import Loader from 'src/components/Loader';

/**
 * Style
 */
const useStyles = makeStyles(theme => ({
  root: {},
  backButton: {
    marginRight: theme.spacing(1)
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  },
  backdrop: {
    zIndex: 10
  }
}));

/**
 * Main component
 * @param {*} props
 */
const UserCreate = props => {
  const classes = useStyles();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  const [userAccess, setUserAccess] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [menus, setMenus] = useState({ menuItems: [], menuSubItems: [] });
  const [steps] = useState([
    'User account',
    'Profile',
    'Menu Items',
    'Menu Sub Items'
  ]);
  const [user, setUser] = useState({
    id: '',
    username: '',
    password: '',
    is_active: '1'
  });

  const [userProfile, setUserProfile] = useState({
    user_id: '',
    profile_avatar: '',
    profile_name: '',
    profile_division: '',
    profile_email: '',
    profile_phone: '',
    profile_address: ''
  });

  const [userMenuItems, setUserMenuItems] = useState([]);
  const [userMenuSubItems, setUserMenuSubItems] = useState([]);

  /**
   * Ambil data user akses pada reduxUserLogin
   */
  useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.map(msi =>
        msi.menu_s_i_url === '/users' ? setUserAccess(msi.pivot) : null
      );
    }

    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (userAccess !== null && userAccess.user_m_s_i_create === 0) {
      navigate('/error/forbidden');
    }
    // eslint-disable-next-line
  }, [userAccess]);

  // mengambil semua data menu dari api
  useEffect(() => {
    const getAllMenus = async () => {
      try {
        let res = await apiGetAllMenus();
        if (isMounted.current) {
          setMenus({
            menuItems: res.data.menu_items,
            menuSubItems: res.data.menu_sub_items
          });
        }
      } catch (err) {
        if (err.status === 401) {
          window.location.href = '/logout';
        }
      }
    };

    getAllMenus();
    return () => {
      isMounted.current = false;
    };
  }, []);

  // keluar aplikasi
  const logout = () => {
    window.location.href = '/logout';
  };

  // handle next step
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  // handle previous step
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  // Fungsi simpan data untuk membuat data user dan frofile baru
  const handleSave = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append('id', user.id);
    formData.append('username', user.username);
    formData.append('password', user.password);
    formData.append('is_active', user.is_active);
    formData.append('user_id', userProfile.user_id);
    formData.append('profile_avatar', userProfile.profile_avatar);
    formData.append('profile_name', userProfile.profile_name);
    formData.append('profile_division', userProfile.profile_division);
    formData.append('profile_email', userProfile.profile_email);
    formData.append('profile_phone', userProfile.profile_phone);
    formData.append('profile_address', userProfile.profile_address);

    try {
      await apiCreateUser(formData);
      if (isMounted.current) {
        try {
          await apiCreateUserMenuAccess(userMenuItems, userMenuSubItems);
          if (isMounted.current) {
            setLoading(false);
            props.setReduxToast({
              show: true,
              type: 'success',
              message: 'New user created successfully'
            });
            navigate('/users');
          }
        } catch (error) {
          if (isMounted.current) {
            setLoading(false);
            error.status === 401 && logout();
            props.setReduxToast({
              show: true,
              type: 'error',
              message: `(#${error.status}) ${error.data.message}`
            });
          }
        }
      }
    } catch (err) {
      if (isMounted.current) {
        setLoading(false);
        err.status === 401 && logout();
        props.setReduxToast({
          show: true,
          type: 'error',
          message: `(#${err.status}) ${err.data.message}`
        });
      }
    }
  };

  /**
   * FUngsi konsidi pemanggilan component saat step aktif
   * @param {aktif step} active
   */
  const stepComponent = active => {
    switch (active) {
      case 1:
        return (
          <ProfileForm
            data={userProfile}
            loading={loading}
            setLoading={bool => setLoading(bool)}
            notification={message => props.setReduxToast(message)}
            setData={data => setUserProfile(data)}
            nextStep={() => handleNext()}
            backStep={() => handleBack()}
          />
        );

      case 2:
        return (
          <AddMenuItems
            user={user}
            data={userMenuItems}
            menus={menus}
            loading={loading}
            setLoading={bool => setLoading(bool)}
            notification={message => props.setReduxToast(message)}
            setData={data => setUserMenuItems(data)}
            nextStep={() => handleNext()}
            backStep={() => handleBack()}
          />
        );

      case 3:
        return (
          <AddMenuSubItems
            user={user}
            userMenuItems={userMenuItems}
            data={userMenuSubItems}
            menus={menus}
            loading={loading}
            setLoading={bool => setLoading(bool)}
            notification={message => props.setReduxToast(message)}
            setData={data => setUserMenuSubItems(data)}
            save={() => handleSave()}
            backStep={() => handleBack()}
          />
        );

      default:
        return (
          <UserForm
            menus={menus}
            data={user}
            loading={loading}
            nextStep={() => handleNext()}
            backStep={() => handleBack()}
            setLoading={bool => setLoading(bool)}
            notification={message => props.setReduxToast(message)}
            setData={data => {
              let newUserProfile = { ...userProfile };
              newUserProfile['user_id'] = data.id;
              setUserProfile(newUserProfile);
              setUser(data);
            }}
          />
        );
    }
  };

  return (
    <Page title="User Create" pageTitle="Create New User" pb={true}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            variant="elevation"
            elevation={3}
          >
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Grid>

        <Grid item xs={12}>
          <Card variant="elevation" elevation={3}>
            <Loader show={loading}>{stepComponent(activeStep)}</Loader>
          </Card>
        </Grid>
      </Grid>

      <div className={classes.fab}>
        <CustomTooltip title="Return to the user page" placement="left">
          <Fab
            color="secondary"
            arial-label="Return to the user page"
            disabled={false}
            onClick={() => navigate('/users')}
          >
            <RotateLeftIcon />
          </Fab>
        </CustomTooltip>
      </div>
    </Page>
  );
};

// Redux dispatch
function reduxDispatch(dispatch) {
  return {
    setReduxToast: error =>
      dispatch({
        type: reduxAction.toast,
        value: error
      })
  };
}

/* Redux State */
function reduxState(state) {
  return {
    reduxUserLogin: state.userLogin
  };
}

export default connect(reduxState, reduxDispatch)(UserCreate);
