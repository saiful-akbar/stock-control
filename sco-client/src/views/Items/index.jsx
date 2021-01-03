import React from 'react';
import Page from 'src/components/Page';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Divider } from '@material-ui/core';
import queryString from 'query-string';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import ItemGroups from './ItemGroups';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  tabPanel: {
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: "100%"
  },
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
    if (location.search !== "") {
      const parsed = queryString.parse(location.search);
      if (parsed.tab === 'itemGroups' || parsed.tab === 'itemSubGroups' || parsed.tab === 'itemList') {
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
    navigate(`${location.pathname}?tab=${newValue}`, { state: location.state });
  };


  /**
   * Render komponen utama
   */
  return (
    <Page
      title='Items'
      pageTitle='Items'
    >
      <div className={classes.root}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            indicatorColor='primary'
            textColor='primary'
            aria-label="tab-items"
            variant="scrollable"
          >
            <Tab label="Item Groups" value="itemGroups" />
            <Tab label="Item Sub Groups" value="itemSubGroups" />
            <Tab label="Item List" value="itemList" />
          </TabList>

          <Divider />

          <TabPanel value="itemGroups" className={classes.tabPanel}>
            <ItemGroups />
          </TabPanel>

          <TabPanel value="itemSubGroups" className={classes.tabPanel}>
            {"Item Sub Groups"}
          </TabPanel>

          <TabPanel value="itemList" className={classes.tabPanel}>
            {"Item List"}
          </TabPanel>
        </TabContext>
      </div>
    </Page>
  )
}


export default Items;