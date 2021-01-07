import React from 'react';
import ItemGroupsTable from './ItemGroupsTable';
import { connect } from 'react-redux';


/**
 * Komponent utama
 */
function ItemGroups(props) {

  const [user_access, setUserAccess] = React.useState(null);

  /**
   * Ambil data user akses pada reduxUserLogin
   */
  React.useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.map((msi) => {
        return msi.menu_s_i_url === '/master/items' ? setUserAccess(msi.pivot) : null;
      });
    }
  }, [props.reduxUserLogin]);


  /**
   * Render komponent utama
   */
  return (
    <ItemGroupsTable userAccess={user_access} />
  )
}


/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
    reduxUserLogin: state.userLogin,
  }
}


export default connect(reduxState, null)(ItemGroups);