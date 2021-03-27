import React, { useState } from 'react';
import MenuSubItemTable from './MenuSubItemTable';
import MenuSubItemForm from './MenuSubItemForm';
import MenuSubItemDelete from './MenuSubItemDelete';
import { useDispatch, useSelector } from 'react-redux';
import { apiGetAllMenuItem } from 'src/services/menuItem';

// Main component
const MenuSubItem = ({ state }) => {
  const [dialogDelete, setDialogDelete] = useState({ open: false, id: null });
  const [dialogForm, setDialogForm] = useState({
    type: 'Create',
    open: false,
    data: null
  });

  /**
   * Redux
   */
  const { menuItems } = useSelector(state => state.menusReducer);
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (menuItems.data === null) dispatch(apiGetAllMenuItem());
  }, [menuItems, dispatch]);

  return (
    <>
      <MenuSubItemTable
        state={state}
        openDialogForm={(open, type, data) => {
          setDialogForm({ open, type, data });
        }}
        openDialogDelete={id => {
          setDialogDelete({ open: true, id: id });
        }}
      />

      {state !== null && (
        <>
          {Boolean(state.create === 1 || state.update === 1) && (
            <MenuSubItemForm
              open={dialogForm.open}
              data={dialogForm.data}
              type={dialogForm.type}
              closeDialog={() => {
                setDialogForm({ type: null, open: false, data: null });
              }}
            />
          )}

          {state.delete === 1 && (
            <MenuSubItemDelete
              id={dialogDelete.id}
              open={dialogDelete.open}
              closeDialog={() => {
                setDialogDelete({ open: false, id: null });
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default MenuSubItem;
