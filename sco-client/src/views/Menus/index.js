import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import Page from 'src/components/Page';
import MenuItem from 'src/views/Menus/MenuItem';
import MenuSubItem from 'src/views/Menus/MenuSubItem';

import { Divider, Container } from '@material-ui/core';
import queryString from 'query-string';
import { makeStyles } from '@material-ui/core/styles';

/* Style untuk komponen Menus */
const useStyles = makeStyles(theme => ({
  tabList: {
    position: 'sticky',
    top: 48,
    backgroundColor: theme.palette.background.dark,
    zIndex: theme.zIndex.appBar + 1
  }
}));

/**
 * Main component
 * @param {props} props
 */
function Menus(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const [value, setValue] = useState('menus');
  const [userAccess, setUserAccess] = useState(null);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /* Cek apakah state bernilai null & state read bernilai 1 */
  useEffect(() => {
    if (props.reduxUserLogin.menuSubItems !== null) {
      props.reduxUserLogin.menuSubItems.map(
        msi => msi.menu_s_i_url === pathname && setUserAccess(msi.pivot)
      );
    }
  }, [props.reduxUserLogin, pathname]);

  /* Menangkap nilai query sting "tab" untuk menemtukan tab yang aktif */
  useEffect(() => {
    const parsed = queryString.parse(location.search);
    parsed.tab === 'subMenus' ? setValue('subMenus') : setValue('menus');
  }, [location.search, setValue]);

  /**
   * Fungsi untuk menghandle Tab
   * @param {obj} event
   * @param {int} newValue
   */
  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(`${pathname}?tab=${newValue}`);
  };

  return (
    <Page title="Menu Managemen" pageTitle="Menu Management">
      <Container maxWidth="md">
        <TabContext value={value}>
          <div className={classes.tabList}>
            <TabList
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="on"
            >
              <Tab label="Menus" value="menus" />
              <Tab label="Sub Menus" value="subMenus" />
            </TabList>
            <Divider />
          </div>

          <TabPanel value="menus">
            <MenuItem state={userAccess} />
          </TabPanel>

          <TabPanel value="subMenus">
            <MenuSubItem state={userAccess} />
          </TabPanel>
        </TabContext>
      </Container>
    </Page>
  );
}

/**
 * redux state
 */
function reduxState(state) {
  return {
    reduxUserLogin: state.authReducer.userLogin
  };
}

export default connect(reduxState, null)(Menus);
