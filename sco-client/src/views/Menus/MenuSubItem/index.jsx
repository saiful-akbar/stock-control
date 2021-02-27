import React, { useState } from 'react';
import MenuSubItemTable from './MenuSubItemTable';
import MenuSubItemForm from './MenuSubItemForm';
import MenuSubItemDelete from './MenuSubItemDelete';

// Main component
const MenuSubItem = ({ state }) => {
  const [reload, setReload] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [dialogDelete, setDialogDelete] = useState({ show: false, id: null });
  const [dialogForm, setDialogForm] = useState({
    type: '',
    show: false,
    data: null
  });

  return (
    <>
      <MenuSubItemTable
        state={state}
        reload={reload}
        setMenuItems={data => setMenuItems(data)}
        openDialogForm={data => setDialogForm(data)}
        openDialogDelete={id => setDialogDelete({ show: true, id: id })}
        stopReload={() => setReload(false)}
      />

      {state !== null && (
        <>
          {Boolean(
            state.user_m_s_i_create === 1 || state.user_m_s_i_update === 1
          ) && (
            <MenuSubItemForm
              open={dialogForm.show}
              data={dialogForm.data}
              type={dialogForm.type}
              menuItems={menuItems}
              reloadTable={() => setReload(true)}
              closeDialog={() =>
                setDialogForm({ type: '', show: false, data: null })
              }
            />
          )}

          {state.user_m_s_i_delete === 1 && (
            <MenuSubItemDelete
              id={dialogDelete.id}
              open={dialogDelete.show}
              reloadTable={() => setReload(true)}
              closeDialog={() => setDialogDelete({ show: false, id: null })}
            />
          )}
        </>
      )}
    </>
  );
};

export default MenuSubItem;
