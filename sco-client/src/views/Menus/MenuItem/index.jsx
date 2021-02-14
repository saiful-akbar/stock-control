import React from 'react';
import MenuItemTable from './MenuItemTable';
import MenuItemCreate from './MenuItemCreate';
import MenuItemEdit from './MenuItemEdit';
import MenuItemDelete from './MenuItemDelete';

const MenuItem = ({ state }) => {
  const [reload, setReload] = React.useState(false);
  const [dialogCreate, setDialogCerate] = React.useState(false);
  const [dialogDelete, setDialogDelete] = React.useState({
    show: false,
    id: null
  });
  const [dialogEdit, setDialogEdit] = React.useState({ show: false, data: {} });

  return (
    <div>
      <MenuItemTable
        state={state}
        reload={reload}
        stopReload={() => setReload(false)}
        openDialogCreate={() => setDialogCerate(true)}
        openDialogDelete={id => setDialogDelete({ show: true, id: id })}
        openDialogEdit={data => setDialogEdit({ show: true, data: data })}
      />
      <MenuItemCreate
        state={state}
        open={dialogCreate}
        close={() => setDialogCerate(false)}
        reloadTable={() => setReload(true)}
      />
      <MenuItemDelete
        state={state}
        id={dialogDelete.id}
        open={dialogDelete.show}
        closeDialog={() => setDialogDelete({ show: false, id: null })}
        reloadTable={() => setReload(true)}
      />
      <MenuItemEdit
        state={state}
        data={dialogEdit.data}
        open={dialogEdit.show}
        reloadTable={() => setReload(true)}
        closeDialog={() => setDialogEdit({ show: false, data: {} })}
      />
    </div>
  );
};

MenuItem.defaultPros = {
  state: {
    create: 0,
    read: 0,
    update: 0,
    delete: 0
  }
};

export default MenuItem;
