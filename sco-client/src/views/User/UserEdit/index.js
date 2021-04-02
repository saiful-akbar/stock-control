import React from 'react';
import Page from 'src/components/Page';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Divider, Container } from '@material-ui/core';
import queryString from 'query-string';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { apiGetAllMenuItem } from 'src/services/menuItem';
import { apiGetAllMenuSubItem } from 'src/services/menuSubItem';
import UserEditAccountProfile from './UserEditAccountProfile';
import UserEditMenuAccess from './UserEditMenuAccess';
import FabReturn from 'src/components/FabReturn';
import { apiGetUserEdit } from 'src/services/user';

/**
 * Komponen utama
 *
 * @param mixed props
 *
 * @return [type]
 */
function UserEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = React.useRef(true);
  const { id } = useParams();

  /**
   * Redux
   */
  const { menuItems, menuSubItems } = useSelector(state => state.menusReducer);
  const dispatch = useDispatch();

  /**
   * State
   */
  const [value, setValue] = React.useState('accountProfile');
  const [isSkeletonShow, setSkeletonShow] = React.useState(true);

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
   * Non
   * @param {*} status
   */

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
      dispatch(apiGetAllMenuItem()).catch(err => {
        if (isMounted.current) handleErrorApiRequest(err.status);
      });
    }

    if (menuSubItems.data === null) {
      dispatch(apiGetAllMenuSubItem()).catch(err => {
        if (isMounted.current) handleErrorApiRequest(err.status);
      });
    }

    // eslint-disable-next-line
  }, [menuItems, menuSubItems, dispatch]);

  /**
   * Ambil data user yang akan di edit dari api
   */
  React.useEffect(() => {
    dispatch(apiGetUserEdit(id))
      .then(() => {
        if (isMounted.current) setSkeletonShow(false);
      })
      .catch(err => {
        if (isMounted.current) handleErrorApiRequest(err.status);
      });

    // eslint-disable-next-line
  }, [dispatch]);

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
    <Page pb title="Edit User" pageTitle="Edit User">
      <Container>
        <TabContext value={value}>
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

          <TabPanel value="accountProfile">
            <UserEditAccountProfile isSkeletonShow={isSkeletonShow} />
          </TabPanel>

          <TabPanel value="menuAccess">
            <UserEditMenuAccess isSkeletonShow={isSkeletonShow} />
          </TabPanel>
        </TabContext>
      </Container>

      <FabReturn returnUrl="/users" title="Return to the user page" />
    </Page>
  );
}

export default UserEdit;
