import React from 'react';
import ItemGroupsTable from './ItemGroupsTable';
import { connect } from 'react-redux';
import ItemGroupForm from './ItemGroupForm';


/**
 * Komponent utama
 */
function ItemGroups(props) {

  const [user_access, setUserAccess] = React.useState(null);
  const [form, setForm] = React.useState({ open: false, type: 'Add', data: {} });

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
    <React.Fragment>
      <ItemGroupsTable
        userAccess={user_access}
        onAdd={() => {
          setForm({
            open: true,
            type: 'Add',
            data: {}
          });
        }}
        onEdit={(value) => {
          setForm({
            open: true,
            type: 'Edit',
            data: value
          });
        }}
      />

      <ItemGroupForm
        open={form.open}
        type={form.type}
        data={form.data}
        onClose={() => {
          setForm({
            open: false,
            type: 'Add',
            data: {}
          });
        }}
      />
    </React.Fragment>
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