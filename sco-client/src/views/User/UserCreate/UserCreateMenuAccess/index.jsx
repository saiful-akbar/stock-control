import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider
} from '@material-ui/core';
import { connect } from 'react-redux';

function UserCreateMenuAccess(props) {
  return (
    <Card eleavtion={3}>
      <CardHeader
        title="Menu Access"
        subheader="Select menu access for the user"
      />

      <CardContent></CardContent>

      <Divider />

      <CardActions></CardActions>
    </Card>
  );
}

export default connect(null, null)(UserCreateMenuAccess);
