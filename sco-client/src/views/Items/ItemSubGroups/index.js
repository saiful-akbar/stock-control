import React from 'react';
import ItemSubGroupTable from './ItemSubGroupsTable';
import ItemSubGroupsForm from './ItemSubGroupsForm';
import { useLocation } from 'react-router';

// Komponen utama
function ItemSubGroup(props) {
  const [isOpenForm, setOpenForm] = React.useState({
    open: false,
    type: null,
    data: null
  });

  const query = new URLSearchParams(useLocation().search);

  React.useEffect(() => {
    console.log('Location: ', query.get('tab'));
  }, [query]);

  return (
    <>
      {isOpenForm.open ? (
        <ItemSubGroupsForm
          type={isOpenForm.type}
          onClose={() => {
            setOpenForm({
              open: false,
              type: null,
              data: null
            });
          }}
        />
      ) : (
        <ItemSubGroupTable
          onAdd={() => {
            setOpenForm({
              open: true,
              type: 'Add',
              data: null
            });
          }}
        />
      )}
    </>
  );
}

export default ItemSubGroup;
