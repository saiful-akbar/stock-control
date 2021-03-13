import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Container } from '@material-ui/core';
import Page from 'src/components/Page';
import DocumentTable from './DocumentTable';
import DocumentForm from './DocumentForm';
import DialogDelete from 'src/components/DialogDelete';
import { apiDeleteDocument } from 'src/services/document';
import { reduxAction } from 'src/config/redux/state';

/* Komponen utama */
function Document(props) {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();

  /* State */
  const [userAccess, setUserAccess] = React.useState(null);
  const [isReloadTable, setReloadTable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    open: false,
    type: 'Add',
    data: null
  });
  const [dialogDelete, setDialogDelete] = React.useState({
    open: false,
    data: []
  });

  /* Handle jika komponen dilepas saat request api belum selesai */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };

    // eslint-disable-next-line
  }, []);

  /* Ambil data user akses pada reduxUserLogin */
  React.useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.map(msi => {
        return msi.menu_s_i_url === '/documents'
          ? setUserAccess(msi.pivot)
          : null;
      });
    }
  }, [props.reduxUserLogin]);

  /* Handle delete document */
  const handleDelete = () => {
    setLoading(true);
    apiDeleteDocument(dialogDelete.data)
      .then(res => {
        if (isMounted.current) {
          setReloadTable(true);
          setLoading(false);
          setDialogDelete({ open: false, data: [] });
          props.setReduxToast(true, 'success', res.data.message);
        }
      })
      .catch(err => {
        if (isMounted.current) {
          switch (err.status) {
            case 401:
              window.location.href = '/logout';
              break;

            case 403:
              navigate('/error/forbidden');
              break;

            case 404:
              navigate('/error/notfound');
              break;

            default:
              setLoading(false);
              props.setReduxToast(
                true,
                'error',
                `(#${err.status}) ${err.data.message}`
              );
              break;
          }
        }
      });
  };

  /* Render */
  return (
    <Page title="Documents" pageTitle="Documents">
      <Container>
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

        <DialogDelete
          title="Delete document"
          open={dialogDelete.open}
          onDelete={handleDelete}
          loading={loading}
          onClose={bool => setDialogDelete({ open: bool, data: [] })}
        />
      </Container>
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

/* Redux reducer */
function reduxDispatch(dispatch) {
  return {
    setReduxToast: (show, type, message) =>
      dispatch({
        type: reduxAction.toast,
        value: {
          show: show,
          type: type,
          message: message
        }
      })
  };
}

export default connect(reduxState, reduxDispatch)(Document);
