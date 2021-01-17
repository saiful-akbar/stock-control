import React from 'react';
import { connect } from 'react-redux';
import Page from 'src/components/Page';
import {
  Grid,
  Typography,
  Box
} from '@material-ui/core';

const Dashboard = (props) => {
  return (
    <Page
      title="Dashboard"
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            p={2}
          >
            <Typography variant="h4" color="textPrimary">
              Welcome to <u><strong>Stock Control Aplication</strong></u>
            </Typography>
          </Box>
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
