import React, { useEffect, useState } from 'react';
import UserTable from './UserTable';
import Page from 'src/components/Page';
import UserDelete from './UserDelete';
import UserChangePassword from './UserChangePassword';
import { Grid, Container } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import UserClearLogs from './UserClearLogs';

// Componen utama
const User = props => {
  const navigate = useNavigate();
  const { userLogin } = useSelector(state => state.authReducer);

  const [userAccess, setUserAccess] = React.useState({});
  const [dialogDelete, setDialogDelete] = useState({
    open: false,
    userId: null
  });
  const [dialogClearLogs, setDialogClearLogs] = useState({
    open: false,
    userId: null
  });
  const [changePassword, setChangePassword] = useState({
    open: false,
    userId: null
  });

  /* Ambil data user akses pada reduxUserLogin */
  useEffect(() => {
    if (userLogin.menuSubItems !== null) {
      userLogin.menuSubItems.map(msi => {
        return msi.menu_s_i_url === '/users' ? setUserAccess(msi.pivot) : {};
      });
    }
  }, [userLogin]);

  /* Cek akses read pada user */
  React.useEffect(() => {
    if (userAccess.read === 0) navigate('/error/forbidden');
  }, [userAccess, navigate]);

  /* render component utama */
  return (
    <Page title="Users" pageTitle="Users">
      <Container maxWidth="md">
        <Grid container spacing={3}>
          <Grid item xs>
            <UserTable
              userAccess={userAccess}
              onDelete={userId =>
                setDialogDelete({ open: true, userId: userId })
              }
              onChangePassword={userId =>
                setChangePassword({ open: true, userId: userId })
              }
              onClearLogs={userId =>
                setDialogClearLogs({ open: true, userId: userId })
              }
            />
          </Grid>
        </Grid>

        <UserDelete
          open={dialogDelete.open}
          userId={dialogDelete.userId}
          onCloseDialog={() => setDialogDelete({ open: false, userId: null })}
        />

        <UserClearLogs
          open={dialogClearLogs.open}
          userId={dialogClearLogs.userId}
          onCloseDialog={() =>
            setDialogClearLogs({ open: false, userId: null })
          }
        />

        <UserChangePassword
          open={changePassword.open}
          userId={changePassword.userId}
          onClose={() => setChangePassword({ open: false, userId: null })}
        />
      </Container>
    </Page>
  );
};

export default User;
