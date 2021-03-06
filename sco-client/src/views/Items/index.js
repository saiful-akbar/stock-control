import React from 'react';
import Page from 'src/components/Page';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';
import { Divider, Container } from '@material-ui/core';
import queryString from 'query-string';
import { useLocation, useNavigate } from 'react-router-dom';
import ItemGroups from './ItemGroups';
import ItemSubGroup from './ItemSubGroups';

/**
 * Komponen utama
 *
 * @param mixed props
 *
 * @return [type]
 */
function Items(props) {
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
      <Container>
        <TabContext value={value}>
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

          <TabPanel value="itemGroups">
            <Container maxWidth="md">
              <ItemGroups />
            </Container>
          </TabPanel>

          <TabPanel value="itemSubGroups">
            <ItemSubGroup />
          </TabPanel>

          <TabPanel value="itemList">{'Item List'}</TabPanel>
        </TabContext>
      </Container>
    </Page>
  );
}

export default Items;
