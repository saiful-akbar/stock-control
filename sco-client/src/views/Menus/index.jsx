import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Page from 'src/components/Page';
import MenuItem from 'src/views/Menus/MenuItem';
import MenuSubItem from 'src/views/Menus/MenuSubItem';

import { apiGetAllMenuItem } from 'src/services/menuItem';
import { apiGetAllMenuSubItem } from 'src/services/menuSubItem';
import { Grid, Box, Divider } from '@material-ui/core';
import queryString from 'query-string';

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
 * Main component
 * @param {props} props 
 */
function Menus(props) {
  const [value, setValue] = useState(0);

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { state, search } = location;



  /**
   * Cek apakah state bernilai null & state read bernilai 1
   */
  useEffect(() => {
    if (state === null || state.read !== 1) {
      navigate('/404');
    }
  });


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
  const handleChange = (event, newValue) => {
    setValue(newValue);
    let tab = newValue === 0 ? 'menuItems' : 'menuSubItems';
    navigate(`/menu?tab=${tab}`, { state: state });
  };


  return (
    <Page
      title='Menu Managemen'
      pageTitle='Menu Management'
    >
      <Grid container spacing={3}>
        <Grid item xs={12} >
          <Box mb={3}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor='primary'
              textColor='primary'
              aria-label='Menus'
            >
              <Tab label='Menus' {...a11yProps(0)} />
              <Tab label='Sub Menus' {...a11yProps(1)} />
            </Tabs>
            <Divider />
          </Box>
        </Grid>
      </Grid>

      <TabPanel value={value} index={0} dir={theme.direction}>
        <MenuItem state={state} />
      </TabPanel>

      <TabPanel value={value} index={1} dir={theme.direction}>
        <MenuSubItem state={state} />
      </TabPanel>
    </Page>
  );
}

/**
 * redux state
 */
function reduxState(state) {
  return {
    reduxMenuItemData: state.menuItemData,
    reduxMenuSubItemData: state.menuSubItemData,
  }
}

/**
 * Redux dispatch
 */
function reduxDispatch(dispatch) {
  return {
    setReduxMenuItemData: () => dispatch(apiGetAllMenuItem()),
    setReduxMenuSubItemData: () => dispatch(apiGetAllMenuSubItem()),
  }
}

export default connect(reduxState, reduxDispatch)(Menus);
