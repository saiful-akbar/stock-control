import React from 'react';
import MenuItemTable from './MenuItemTable';
import MenuItemForm from './MenuItemForm';
import MenuItemDelete from './MenuItemDelete';

const MenuItem = ({ state }) => {
  const [reload, setReload] = React.useState(false);
  const [dialogDelete, setDialogDelete] = React.useState({
    show: false,
    id: null
  });

  const [formDialog, setFormDialog] = React.useState({
    open: false,
    type: 'Create',
    data: null
  });

  return (
    <div>
      <MenuItemTable
        state={state}
        reload={reload}
        stopReload={() => setReload(false)}
        openDialogCreate={() =>
          setFormDialog({ open: true, type: 'Create', data: null })
        }
        openDialogEdit={data =>
          setFormDialog({ open: true, type: 'Edit', data: data })
        }
        openDialogDelete={id => setDialogDelete({ show: true, id: id })}
      />
      <MenuItemForm
        state={state}
        open={formDialog.open}
        type={formDialog.type}
        data={formDialog.data}
        onReloadTable={() => setReload(true)}
        onClose={() =>
          setFormDialog({ open: false, type: formDialog.type, data: null })
        }
      />
      <MenuItemDelete
        state={state}
        id={dialogDelete.id}
        open={dialogDelete.show}
        closeDialog={() => setDialogDelete({ show: false, id: null })}
        reloadTable={() => setReload(true)}
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
