import React from 'react';
import { TableCell, TableSortLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tableCell: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));


/**
 * Komponen utama
 */
function Thead(props) {
  const classes = useStyles();


  /**
   * Render komponen utama
   */
  return (
    <TableCell align={props.column.align} className={classes.tableCell} >
      <TableSortLabel
        active={Boolean(props.data.sort === props.column.field)}
        onClick={() => props.onSort(props.column.field)}
        direction={
          props.data.sort === props.column.field
            ? props.data.order_by
            : 'asc'
        }
      >
        {props.column.label}
        {props.data.sort === props.column.field && (
          <span className={classes.visuallyHidden}>
            {
              props.data.order_by === 'desc'
                ? 'sorted descending'
                : 'sorted ascending'
            }
          </span>
        )}
      </TableSortLabel>
    </TableCell>
  )
}


/**
 * default props
 */
Thead.defaultProps = {
  column: {
    field: '',
    label: '',
    align: 'left',
  },
  selectted: [],
  data: [],
  onSort: () => null,
};


export default Thead;