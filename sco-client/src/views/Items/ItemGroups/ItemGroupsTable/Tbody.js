import React from 'react';
import { TableRow, TableCell, Checkbox, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import CustomTooltip from 'src/components/CustomTooltip';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
// import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

/* Style */
const useStyles = makeStyles(theme => ({
  root: {
    padding: 10
  }
}));

/* Komponne utama */
function Tbody({ row, columns, userAccess, onEdit, onSelect, ...props }) {
  const classes = useStyles();

  /* Render komponen utama */
  return (
    <TableRow {...props}>
      {userAccess.delete === 1 && (
        <TableCell padding="checkbox">
          <CustomTooltip placement="bottom" title="Select">
            <Checkbox
              color="primary"
              checked={props.selected}
              onClick={e => onSelect(e, row.id)}
            />
          </CustomTooltip>
        </TableCell>
      )}

      {columns.map((col, key) => (
        <TableCell
          key={key}
          className={classes.root}
          padding={userAccess.delete === 1 ? 'checkbox' : 'default'}
        >
          {row[col.field]}
        </TableCell>
      ))}

      {userAccess.update === 1 && (
        <TableCell padding="checkbox">
          <CustomTooltip placement="bottom" title="Edit">
            <IconButton onClick={() => onEdit(row)}>
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </CustomTooltip>
        </TableCell>
      )}
    </TableRow>
  );
}

/* default props */
Tbody.defaultProps = {
  row: {},
  columns: [],
  userAccess: {},
  onEdit: e => e.preventDefault(),
  onSelect: e => e.preventDefault()
};

export default Tbody;
