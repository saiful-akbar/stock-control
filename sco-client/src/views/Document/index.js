import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Container } from '@material-ui/core';
import Page from 'src/components/Page';
import DocumentTable from './DocumentTable';
import DocumentForm from './DocumentForm';
import DialogDelete from 'src/components/DialogDelete';
import { apiDeleteDocument } from 'src/services/document';

/* Komponen utama */
function Document(props) {
  const isMounted = React.useRef(true);
  const navigate = useNavigate();

  const { userLogin } = useSelector(state => state.authReducer);
  const dispatch = useDispatch();

  /* State */
  const [userAccess, setUserAccess] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    open: false,
    type: 'Add',
    data: null
  });
  const [dialogDelete, setDialogDelete] = React.useState({
    open: false,
    selected: []
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
    if (userLogin.menuSubItems !== null) {
      userLogin.menuSubItems.map(msi => {
        return msi.menu_s_i_url === '/documents'
          ? setUserAccess(msi.pivot)
          : null;
      });
    }
  }, [userLogin]);

  /* Handle delete document */
  const handleDelete = async () => {
    setLoading(true);
    try {
      await dispatch(apiDeleteDocument(dialogDelete.selected));
      if (isMounted.current) {
        setLoading(false);
        setDialogDelete({ open: false, selected: [] });
      }
    } catch (err) {
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
            break;
        }
      }
    }
  };

  /* Render */
  return (
    <Page title="Documents" pageTitle="Documents">
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <DocumentTable
              userAccess={userAccess}
              selectedRows={dialogDelete.selected}
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
          </Grid>
        </Grid>

        <DocumentForm
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

        <DialogDelete
          title="Delete document"
          open={dialogDelete.open}
          onDelete={handleDelete}
          loading={loading}
          onClose={bool => setDialogDelete({ open: bool, selected: [] })}
        />
      </Container>
    </Page>
  );
}

export default Document;
