import React from 'react';
import { Card, CardContent, Grid, Button } from '@material-ui/core';
import ItemGroupsTable from '../../ItemGroups/ItemGroupsTable';


// Komponen utama
function ItemSubGroupTable(props) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => props.onAdd()}
            >
              {"Add New"}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <table>
              <thead>
                <tr>
                  <th>Group Code</th>
                  <th>Sub Group Code</th>
                  <th>Sub Group Name</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ash</td>
                  <td>ashashj</td>
                  <td>ashashjl</td>
                </tr>
                <tr>
                  <td>ash</td>
                  <td>ashashj</td>
                  <td>ashashjl</td>
                </tr>
                <tr>
                  <td>ash</td>
                  <td>ashashj</td>
                  <td>ashashjl</td>
                </tr>
              </tbody>
            </table>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}


// Default props komponene ItemGroupsTable
ItemGroupsTable.defaultProps = {
  onAdd: (e) => e.preventDefault(),
};


export default ItemSubGroupTable;