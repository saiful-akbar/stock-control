import React from 'react';
import MenuItemTable from './MenuItemTable';
import MenuItemForm from './MenuItemForm';
import MenuItemDelete from './MenuItemDelete';

const MenuItem = ({ state }) => {
  const [dialogDelete, setDialogDelete] = React.useState({
    open: false,
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
        openFormDialog={(open, type, data) => {
          setFormDialog({ open: open, type: type, data: data });
        }}
        openDialogDelete={id => {
          setDialogDelete({ open: true, id: id });
        }}
      />

      <MenuItemForm
        state={state}
        open={formDialog.open}
        type={formDialog.type}
        data={formDialog.data}
        onClose={() => {
          setFormDialog({ open: false, type: formDialog.type, data: null });
        }}
      />

      <MenuItemDelete
        state={state}
        id={dialogDelete.id}
        open={dialogDelete.open}
        closeDialog={() => {
          setDialogDelete({ open: false, id: null });
        }}
      />
    </div>
  );
};

export default MenuItem;
