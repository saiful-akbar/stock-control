import React, {
  useEffect,
  useState
} from 'react';
import {
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Page from 'src/components/Page';
import {
  Tabs,
  Tab,
  Divider,
  Fab,
  Grid,
} from '@material-ui/core';
import {
  useTheme,
  makeStyles
} from '@material-ui/core/styles';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import CustomTooltip from 'src/components/CustomTooltip';
import UserMenuItems from './UserMenuItems';
import UserMenuSubItems from './UserMenuSubItems';
import UserProfile from './UserProfile';
import queryString from 'query-string';


/**
 * Style
 */
const useStyle = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 1
  },
}));

/**
 * Component Tabpanel
 * @param {props} props 
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}


/**
 * default value component TabPanel
 */
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


/**
 * props pada component Tab
 * @param {index tabs} index 
 */
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}


/**
 * Komponen utama
 * @param {*} props 
 */
function UserEditMenuAccess(props) {
  const classes = useStyle();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { state, search } = location;
  const { id } = useParams();

  const [value, setValue] = useState(0);
  const [profile, setProfile] = useState(null);


  /**
   * Cek apakah state bernilai null atau tidak & state.update bernilai 1 atau tidak
   * Jika tidak arahkan ke halaman 404
   */
  useEffect(() => {
    if (state === null || state.update !== 1 || state.profile === null) {
      navigate('/404');
    } else {
      setProfile(state.profile)
    }
  }, [state, navigate]);


  /**
   * Menangkap nilai query sting "tab" untuk menemtukan tab yang aktif
   */
  useEffect(() => {
    const parsed = queryString.parse(search);
    setValue(parsed.tab === 'menuSubItems' ? 1 : 0);
  }, [search]);


  /**
   * Fungsi untuk menghandle Tab
   * @param {obj} event 
   * @param {int} newValue 
   */
  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
    let tab = newValue === 0 ? 'menuItems' : 'menuSubItems';
    navigate(`/user/menus/${id}?tab=${tab}`, { state: state });
  };


  /**
   * Render komponen utama
   */
  return (
    <Page
      title='User Menus'
      pageTitle='User Menus'
      pb={true}
    >
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item md={4} xs={12}>
          <UserProfile data={profile} />
        </Grid>

        <Grid item md={8} xs={12}>
          <Tabs
            value={value}
            onChange={handleChangeTabs}
            indicatorColor='primary'
            textColor='primary'
            aria-label='Access the user menu'
          >
            <Tab label='Menu Items' {...a11yProps(0)} />
            <Tab label='Menu Sub Items' {...a11yProps(1)} />
          </Tabs>
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <TabPanel value={value} index={0} dir={theme.direction} >
            <UserMenuItems userId={id} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction} >
            <UserMenuSubItems userId={id} />
          </TabPanel>
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
            onClick={() => navigate('/user', { state: state })}
          >
            <RotateLeftIcon />
          </Fab>
        </CustomTooltip>
      </div>
    </Page >
  )
}


export default UserEditMenuAccess;