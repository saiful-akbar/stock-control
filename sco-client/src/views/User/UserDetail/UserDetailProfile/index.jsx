import React from 'react';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import WorkIcon from '@material-ui/icons/Work';
import MailIcon from '@material-ui/icons/Mail';
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

/**
 * Komponen utama
 */
function UserDetailProfile({ data, ...props }) {
  const isMounted = React.useRef(true);

  /**
   * Fungsi untuk menghendel jika komponent dilepas saat request api belum selesai
   */
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line
  }, []);

  /**
   * Render Komponen utama
   */
  return (
    <Card elevation={3}>
      <CardContent>
        <List>
          <ListItem>
            <ListItemIcon>
              {data === null ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <PersonIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                data === null ? (
                  <Skeleton variant="text" width="50%" />
                ) : data.account.username === null ? (
                  '...'
                ) : (
                  data.account.username
                )
              }
              secondary={
                data === null ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  'Username'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {data === null ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <AccountBoxIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                data === null ? (
                  <Skeleton variant="text" width="50%" />
                ) : data.profile.profile_name === null ? (
                  '...'
                ) : (
                  data.profile.profile_name
                )
              }
              secondary={
                data === null ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  'Profile name'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {data === null ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <WorkIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                data === null ? (
                  <Skeleton variant="text" width="50%" />
                ) : data.profile.profile_division === null ? (
                  '...'
                ) : (
                  data.profile.profile_division
                )
              }
              secondary={
                data === null ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  'Division'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {data === null ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <MailIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                data === null ? (
                  <Skeleton variant="text" width="50%" />
                ) : data.profile.profile_email === null ? (
                  '...'
                ) : (
                  data.profile.profile_email
                )
              }
              secondary={
                data === null ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  'Email'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {data === null ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <PhoneAndroidIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                data === null ? (
                  <Skeleton variant="text" width="50%" />
                ) : data.profile.profile_phone === null ? (
                  '...'
                ) : (
                  data.profile.profile_phone
                )
              }
              secondary={
                data === null ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  'Phone'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {data === null ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <LocationOnIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                data === null ? (
                  <Skeleton variant="text" width="50%" />
                ) : data.profile.profile_address === null ? (
                  '...'
                ) : (
                  data.profile.profile_address
                )
              }
              secondary={
                data === null ? (
                  <Skeleton variant="text" width="30%" />
                ) : (
                  'Address'
                )
              }
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

/**
 * Properti default untuk komponen UserDetailProfile
 */
UserDetailProfile.defaultProps = {
  data: null
};

export default UserDetailProfile;
