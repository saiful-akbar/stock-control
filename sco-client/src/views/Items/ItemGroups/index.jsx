import React from 'react';
import ItemGroupsTable from './ItemGroupsTable';
import { connect } from 'react-redux';
import ItemGroupForm from './ItemGroupForm';
import ItemGroupDelete from './ItemGroupDelete';


/**
 * Komponent utama
 */
function ItemGroups(props) {

  const [userAccess, setUserAccess] = React.useState(null);
  const [isReloadTable, setReloadTable] = React.useState(false);
  const [form, setForm] = React.useState({ open: false, type: 'Add', data: null });
  const [dialogDelete, setDialogDelete] = React.useState({ open: false, data: [] });

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
        userAccess={userAccess}
        reload={isReloadTable}
        selectedRows={dialogDelete.data}
        onReloadTable={(bool) => setReloadTable(bool)}
        onAdd={() => {
          setForm({
            open: true,
            type: 'Add',
            data: null
          });
        }}
        onEdit={(value) => {
          setForm({
            open: true,
            type: 'Edit',
            data: value
          });
        }}
        onDelete={(selected) => {
          setDialogDelete({
            open: true,
            data: selected
          });
        }}
      />

      <ItemGroupForm
        open={form.open}
        type={form.type}
        data={form.data}
        onReloadTable={(bool) => setReloadTable(bool)}
        onClose={() => {
          setForm({
            open: false,
            type: form.type,
            data: null
          });
        }}
      />

      <ItemGroupDelete
        open={dialogDelete.open}
        data={dialogDelete.data}
        onReloadTable={(bool) => setReloadTable(bool)}
        onClose={() => {
          setDialogDelete({
            open: false,
            data: []
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