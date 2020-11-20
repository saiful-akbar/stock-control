import React from 'react';
import { Card, CardContent } from '@material-ui/core';

const UserMenuItems = (props) => {
  const { userId } = props;


  return (
    <Card variant='outlined'>
      <CardContent>
        {userId}
      </CardContent>
    </Card>
  );
};

export default UserMenuItems;