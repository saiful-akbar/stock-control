import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Button,
  CardHeader
} from '@material-ui/core';
import { connect } from 'react-redux';


// Komponen utama
function ItemSubGroupsForm(props) {


  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="flex-start"
    >
      <Grid item md={8} sm={10} xs={12}>
        <Card
          elevation={3}
          variant={
            props.reduxTheme === "dark"
              ? "outlined"
              : "elevation"
          }
        >
          <CardHeader
            title={props.type}
            subheader={
              props.type === "Add"
                ? "Add new item sub group"
                : "Edit item sub group"
            }
          />

          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => props.onClose()}
                >
                  {"Cancel"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}


// Default props komponene ItemGroupsTable
ItemSubGroupsForm.defaultProps = {
  onClose: (e) => e.preventDefault(),
};


function reduxState(state) {
  return {
    reduxTheme: state.theme
  };
}


export default connect(reduxState, null)(ItemSubGroupsForm);