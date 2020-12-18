import React, {
  useEffect,
  useState
} from 'react';
import UserTable from './UserTable';
import Page from 'src/components/Page';
import {
  useLocation,
  useNavigate
} from 'react-router-dom';
import UserDelete from './UserDelete';
import UserChangePassword from './UserChangePassword';
import { Grid } from '@material-ui/core';


// Componen utama
const User = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [reloadTable, setReloadTable] = useState(false);
  const [dialogDelete, setDialogDelete] = useState({ open: false, userId: null });
  const [changePassword, setChangePassword] = useState({ open: false, userId: null });


  /**
   * Cek apakah terdapat satate dari url atau tidak
   * Dan cek apakah state read bernilai true/1 atau false/0
   */
  useEffect(() => {
    if (location.state === null || location.state.read !== 1) {
      navigate('/404');
    }
  }, [location.state, navigate]);


  // render component utama
  return (
    <Page title='Users' pageTitle='Users'>
      <Grid container spacing={3}>
        <Grid item xs >
          <UserTable
            state={location.state}
            reload={reloadTable}
            setReload={bool => setReloadTable(bool)}
            onDelete={userId => setDialogDelete({ open: true, userId: userId })}
            onChangePassword={userId => setChangePassword({ open: true, userId: userId })}
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
  )
};


export default User;