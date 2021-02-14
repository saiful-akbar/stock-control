import React from 'react';
import { connect } from 'react-redux';
import Page from 'src/components/Page';
import { Grid } from '@material-ui/core';
import Landing from './Landing';

const Dashboard = props => {
  return (
    <Page title="Dashboard">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Landing />
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
  };
}

export default connect(reduxState, null)(Dashboard);
