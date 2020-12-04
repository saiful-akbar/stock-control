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
  Box,
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


// Style
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


// default value component TabPanel
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


// Komponen utama
function UserEditMenuAccess(props) {
  const classes = useStyle();
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const location = useLocation();
  const { state } = location;

  const [value, setValue] = useState(0);

  /**
   * Cek apakah state bernilai null atau tidak & state.update bernilai 1 atau tidak
   * Jika tidak arahkan ke halaman 404
   */
  useEffect(() => {
    if (state === null || state.update !== 1) {
      navigate('/404');
    }
  }, [state, navigate]);


  // Fungsi untuk menghandle Tab
  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };


  // Render komponen utama
  return (
    <Page
      title='User Menus'
      pageTitle='User Menus'
      pb={true}
    >
      <UserProfile data={state} />

      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
      >
        <Grid item xs={12}>
          <Box mb={3}>
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
          </Box>
          <TabPanel id={id} value={value} index={0} dir={theme.direction} >
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