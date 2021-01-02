import React from 'react';
import { connect } from 'react-redux';
import Page from 'src/components/Page';
import {
  Grid,
  Typography,
  Paper,
  Box
} from '@material-ui/core';

const Dashboard = (props) => {
  return (
    <Page
      title="Dashboard"
      pageTitle='Dashboard'
    >
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates consequuntur quo quisquam tempore nobis cumque itaque quis quaerat error! Veniam, voluptas minima beatae officiis optio eligendi! Voluptate ipsa aliquam ad?
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Page>
  );
};


/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, null)(Dashboard);
