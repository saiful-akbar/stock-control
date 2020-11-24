import React from 'react';
import { Card, CardContent } from '@material-ui/core';

const UserMenuSubItems = (props) => {
  const { userId } = props;


  return (
    <Card elevation={3}>
      <CardContent>
        {userId}
      </CardContent>
    </Card>
  );
};

export default UserMenuSubItems;