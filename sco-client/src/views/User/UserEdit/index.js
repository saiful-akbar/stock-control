import React from 'react';
import Page from 'src/components/Page';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Divider, Container, Fab } from '@material-ui/core';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { apiGetAllMenuItem } from 'src/services/menuItem';
import { apiGetAllMenuSubItem } from 'src/services/menuSubItem';
import UserEditAccountProfile from './UserEditAccountProfile';
import CustomTooltip from 'src/components/CustomTooltip';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';

/**
 * Style untuk komponen UserEdit
 */
const useStyles = makeStyles(theme => ({
  tabList: {
    position: 'sticky',
    top: 48,
    zIndex: theme.zIndex.appBar + 1,
    backgroundColor: theme.palette.background.dark
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: theme.zIndex.appBar + 1
  }
}));

/**
 * Komponen utama
 *
 * @param mixed props
 *
 * @return [type]
 */
function UserEdit() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = React.useRef(true);

  /**
   * Redux
   */
  const { menuItems, menuSubItems } = useSelector(state => state.menusReducer);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [value, setValue] = React.useState('accountProfile');
  const [isSkeletonShow, setSkeletonShow] = React.useState(false);

  /**
   * Handle jika komponent dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Fungsi handle error request api
   *
   * @param {number} status
   */
  const handleErrorApiRequest = status => {
    switch (status) {
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
  };

  /**
   * Cek apakah data menu sudah ada di redux atau belum
   */
  React.useEffect(() => {
    if (menuItems.data === null) {
      setSkeletonShow(true);
      dispatch(apiGetAllMenuItem())
        .then(() => {
          if (isMounted.current) setSkeletonShow(false);
        })
        .catch(err => {
          if (isMounted.current) handleErrorApiRequest(err.status);
        });
    }

    if (menuSubItems.data === null) {
      setSkeletonShow(true);
      dispatch(apiGetAllMenuSubItem())
        .then(() => {
          if (isMounted.current) setSkeletonShow(false);
        })
        .catch(err => {
          if (isMounted.current) handleErrorApiRequest(err.status);
        });
    }

    // eslint-disable-next-line
  }, [menuItems, menuSubItems, dispatch]);

  /**
   * Cek dan ambil query string
   */
  React.useEffect(() => {
    const parsed = queryString.parse(location.search);
    parsed.tab === 'menuAccess'
      ? setValue('menuAccess')
      : setValue('accountProfile');
  }, [location.search]);

  /**
   * FUngsi untuk menghendel tab
   *
   * @param {obj} event
   * @param {string} newValue
   */
  const handleChange = (event, newValue) => {
    event.preventDefault();
    navigate(location.pathname + `?tab=${newValue}`);
  };

  /**
   * Render komponen utama
   */
  return (
    <Page title="Edit User" pageTitle="Edit User">
      <Container>
        <TabContext value={value}>
          <div className={classes.tabList}>
            <TabList
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="on"
            >
              <Tab label="Account & Profile" value="accountProfile" />
              <Tab label="Menu Access" value="menuAccess" />
            </TabList>
            <Divider />
          </div>

          <TabPanel value="accountProfile">
            <UserEditAccountProfile isSkeletonShow={isSkeletonShow} />
          </TabPanel>

          <TabPanel value="menuAccess">
            <div>Menu Sccess</div>
          </TabPanel>
        </TabContext>
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

export default UserEdit;
