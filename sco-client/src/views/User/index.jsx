import React, { useEffect, useState } from 'react';
import UserTable from './UserTable';
import Page from 'src/components/Page';
import UserDelete from './UserDelete';
import UserChangePassword from './UserChangePassword';
import { Grid, Container } from '@material-ui/core';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

// Componen utama
const User = props => {
  const navigate = useNavigate();
  const userLogin = useSelector(state => state.userLogin);

  const [userAccess, setUserAccess] = React.useState(null);
  const [reloadTable, setReloadTable] = useState(false);
  const [dialogDelete, setDialogDelete] = useState({
    open: false,
    userId: null
  });
  const [changePassword, setChangePassword] = useState({
    open: false,
    userId: null
  });

  React.useEffect(() => {
    console.log(userLogin);
  }, [userLogin]);

  /* Ambil data user akses pada reduxUserLogin */
  useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.map(msi =>
        msi.menu_s_i_url === '/users' ? setUserAccess(msi.pivot) : null
      );
    }
  }, [props.reduxUserLogin]);

  /* Cek akses read pada user */
  React.useEffect(() => {
    if (userAccess !== null && userAccess.user_m_s_i_read === 0) {
      navigate('/error/forbidden');
    }
  }, [userAccess, navigate]);

  /* render component utama */
  return (
    <Page title="Users" pageTitle="Users">
      <Container>
        <Grid container spacing={3}>
          <Grid item xs>
            <UserTable
              state={userAccess}
              reload={reloadTable}
              setReload={bool => setReloadTable(bool)}
              onDelete={userId =>
                setDialogDelete({ open: true, userId: userId })
              }
              onChangePassword={userId =>
                setChangePassword({ open: true, userId: userId })
              }
            />
          </Grid>
        </Grid>

        <UserDelete
          open={dialogDelete.open}
          userId={dialogDelete.userId}
          reloadTable={() => setReloadTable(true)}
          closeDialog={() => setDialogDelete({ open: false, userId: null })}
        />

        <UserChangePassword
          open={changePassword.open}
          userId={changePassword.userId}
          onClose={() => setChangePassword({ open: false, userId: null })}
          onReloadTable={() => setReloadTable(true)}
        />
      </Container>
    </Page>
  );
};

/* Redux State */
function reduxState(state) {
  return {
    reduxUserLogin: state.userLogin
  };
}

export default connect(reduxState, null)(User);
