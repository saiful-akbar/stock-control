import React from 'react';
import ItemGroupsTable from './ItemGroupsTable';
import { connect } from 'react-redux';
import ItemGroupForm from './ItemGroupForm';
import ItemGroupDelete from './ItemGroupDelete';
import ItemGroupImport from './ItemGroupImport';

/**
 * Komponent utama
 */
function ItemGroups({ reduxUserLogin }) {
  const [userAccess, setUserAccess] = React.useState(null);
  const [isOpenDialogImport, setOpenDialogImport] = React.useState(false);
  const [form, setForm] = React.useState({
    open: false,
    type: 'Add',
    data: null
  });
  const [dialogDelete, setDialogDelete] = React.useState({
    open: false,
    selected: []
  });

  /**
   * Ambil data user akses pada reduxUserLogin
   */
  React.useEffect(() => {
    if (reduxUserLogin.menuSubItems !== null) {
      reduxUserLogin.menuSubItems.map(msi => {
        return msi.menu_s_i_url === '/items' ? setUserAccess(msi.pivot) : null;
      });
    }
  }, [reduxUserLogin]);

  /**
   * Render komponent utama
   */
  return (
    <React.Fragment>
      <ItemGroupsTable
        userAccess={userAccess}
        selectedRows={dialogDelete.selected}
        onImport={() => setOpenDialogImport(true)}
        onAdd={() => {
          setForm({
            open: true,
            type: 'Add',
            data: null
          });
        }}
        onEdit={value => {
          setForm({
            open: true,
            type: 'Edit',
            data: value
          });
        }}
        onDelete={selected => {
          setDialogDelete({
            open: true,
            selected: selected
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
            type: form.type,
            data: null
          });
        }}
      />

      <ItemGroupDelete
        open={dialogDelete.open}
        selected={dialogDelete.selected}
        onClose={() => {
          setDialogDelete({
            open: false,
            selected: []
          });
        }}
      />

      <ItemGroupImport
        open={isOpenDialogImport}
        onClose={() => setOpenDialogImport(false)}
      />
    </React.Fragment>
  );
}

/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxUserLogin: state.authReducer.userLogin
  };
}

export default connect(reduxState, null)(ItemGroups);
