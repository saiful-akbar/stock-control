import React from 'react';
import Page from 'src/components/Page';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Divider } from '@material-ui/core';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemGroups from './ItemGroups';
import ItemSubGroup from './ItemSubGroups';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  tabList: {
    position: 'sticky',
    top: 48,
    backgroundColor: theme.palette.background.dark,
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
function Items(props) {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * State
   */
  const [value, setValue] = React.useState('itemGroups');

  /**
   * Cek dan ambil query string
   */
  React.useEffect(() => {
    if (location.search !== '') {
      const parsed = queryString.parse(location.search);
      if (
        parsed.tab === 'itemGroups' ||
        parsed.tab === 'itemSubGroups' ||
        parsed.tab === 'itemList'
      ) {
        setValue(parsed.tab);
      } else {
        setValue('itemGroups');
      }
    }
  }, [location.search]);

  /**
   * FUngsi untuk menghendel tab
   *
   * @param {obj} event
   * @param {string} newValue
   */
  const handleChange = (event, newValue) => {
    event.preventDefault();
    navigate(`/items?tab=${newValue}`);
  };

  /**
   * Render komponen utama
   */
  return (
    <Page title="Items" pageTitle="Items">
      <TabContext value={value}>
        <div className={classes.tabList}>
          <TabList
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
          >
            <Tab label="Item Groups" value="itemGroups" />
            <Tab label="Item Sub Groups" value="itemSubGroups" />
            <Tab label="Item List" value="itemList" />
          </TabList>

          <Divider />
        </div>

        <TabPanel value="itemGroups">
          <ItemGroups />
        </TabPanel>

        <TabPanel value="itemSubGroups">
          <ItemSubGroup />
        </TabPanel>

        <TabPanel value="itemList">{'Item List'}</TabPanel>
      </TabContext>
    </Page>
  );
}

export default Items;
