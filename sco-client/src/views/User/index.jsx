import React, { useEffect, useState } from 'react';
import UserTable from './UserTable';
import Page from 'src/components/Page';
import UserDelete from './UserDelete';
import UserChangePassword from './UserChangePassword';
import { Grid } from '@material-ui/core';
import { connect } from 'react-redux';

// Componen utama
const User = props => {
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

  /**
   * Ambil data user akses pada reduxUserLogin
   */
  useEffect(() => {
    if (props.reduxUserLogin !== null) {
      props.reduxUserLogin.menu_sub_items.map(msi => {
        return msi.menu_s_i_url === '/user' ? setUserAccess(msi.pivot) : null;
      });
    }
  }, [props.reduxUserLogin]);

  // render component utama
  return (
    <Page title="Users" pageTitle="Users">
      <Grid container spacing={3}>
        <Grid item xs>
          <UserTable
            state={userAccess}
            reload={reloadTable}
            setReload={bool => setReloadTable(bool)}
            onDelete={userId => setDialogDelete({ open: true, userId: userId })}
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
    </Page>
  );
};

/* Redux State */
function reduxState(state) {
  return {
    reduxTheme: state.theme,
    reduxUserLogin: state.userLogin
  };
}

export default connect(reduxState, null)(User);
