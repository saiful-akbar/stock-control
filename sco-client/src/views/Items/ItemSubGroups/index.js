import React from 'react';
import ItemSubGroupTable from './ItemSubGroupsTable';
import ItemSubGroupsForm from './ItemSubGroupsForm';


// Komponen utama
function ItemSubGroup(props) {
  const [isOpenForm, setOpenForm] = React.useState({
    open: true,
    type: null,
    data: null
  });


  return (
    <>
      {isOpenForm.open
        ? (
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
                type: "Add",
                data: null,
              });
            }}
          />
        )
      }
    </>
  )
}


export default ItemSubGroup;