import React from 'react';
import { TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';


/**
 * Style
 */
const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: 10,
    paddingTop: 10
  }
}));


/**
 * Komponne utama
 */
function Tbody(props) {
  const classes = useStyles();


  /**
   * Render komponen utama
   */
  return (
    <TableRow>
      {props.columns.map((col, key) => (
        <TableCell key={key} className={classes.root} >
          {props.row[col.field]}
        </TableCell>
      ))}
    </TableRow>
  )
}


/**
 * default props
 */
Tbody.defaultProps = {
  rows: [],
  columns: [],
  onUpdate: (e) => e.preventDefault(),
};


export default Tbody;