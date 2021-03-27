import React from 'react';
import {
  Grid,
} from '@material-ui/core';
import Page from 'src/components/Page';
import Profile from './Profile';
import ProfileDetails from './ProfileDetails';

const Account = () => {
  return (
    <Page
      title="Account"
      page="Account"
    >
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <Profile />
        </Grid>
        <Grid
          item
          lg={8}
          md={6}
          xs={12}
        >
          <ProfileDetails />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Account;
