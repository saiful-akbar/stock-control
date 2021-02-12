import React from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import Page from 'src/components/Page';
import DocumentTable from './DocumentTable';
import DocumentForm from './DocumentForm';

/* Komponen utama */
function Document(props) {
  /* State */
  const [userAccess, setUserAccess] = React.useState(null);
  const [isReloadTable, setReloadTable] = React.useState(false);
  const [form, setForm] = React.useState({
    open: false,
    type: 'Add',
    data: null
  });
  const [dialogDelete, setDialogDelete] = React.useState({
    open: false,
    data: []
  });

  /* Ambil data user akses pada reduxUserLogin */
  React.useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_items.map(mi => {
        return mi.menu_i_url === '/documents' ? setUserAccess(mi.pivot) : null;
      });
    }
  }, [props.reduxUserLogin]);

  /* Render */
  return (
    <Page title="Documents" pageTitle="Documents">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DocumentTable
            userAccess={userAccess}
            reload={isReloadTable}
            selectedRows={dialogDelete.data}
            onReloadTable={bool => setReloadTable(bool)}
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
                data: selected
              });
            }}
          />
        </Grid>
      </Grid>

      <DocumentForm
        open={form.open}
        type={form.type}
        data={form.data}
        onReloadTable={bool => setReloadTable(bool)}
        onClose={() => {
          setForm({
            open: false,
            type: form.type,
            data: null
          });
        }}
      />
    </Page>
  );
}

/* Redux state */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
    reduxUserLogin: state.userLogin
  };
}

export default connect(reduxState, null)(Document);
