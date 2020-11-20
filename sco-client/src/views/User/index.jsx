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


// Componen utama
const User = (props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [reloadTable, setReloadTable] = useState(false);
  const [dialogDelete, setDialogDelete] = useState({ open: false, userId: null });


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
      <UserTable
        state={location.state}
        reload={reloadTable}
        setReload={(bool) => setReloadTable(bool)}
        openDialogDelete={(userId) => setDialogDelete({ open: true, userId: userId })}
      />

      <UserDelete
        open={dialogDelete.open}
        userId={dialogDelete.userId}
        reloadTable={() => setReloadTable(true)}
        closeDialog={() => setDialogDelete({ open: false, userId: null })}
      />
    </Page>
  )
};


export default User;