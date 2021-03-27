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
import { useSelector } from 'react-redux';

/**
 * Komponen utama
 */
function UserDetailProfile({ isSkeletonShow }) {
  const isMounted = React.useRef(true);

  /**
   * Redux
   */
  const { account, profile } = useSelector(
    state => state.usersReducer.userDetail
  );

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
              {isSkeletonShow ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <PersonIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="60%" />
                ) : account.username === null ? (
                  '......'
                ) : (
                  account.username
                )
              }
              secondary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="40%" />
                ) : (
                  'Username'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {isSkeletonShow ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <AccountBoxIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="60%" />
                ) : profile.name === null ? (
                  '......'
                ) : (
                  profile.name
                )
              }
              secondary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="40%" />
                ) : (
                  'Profile name'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {isSkeletonShow ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <WorkIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="60%" />
                ) : profile.division === null ? (
                  '......'
                ) : (
                  profile.division
                )
              }
              secondary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="40%" />
                ) : (
                  'Division'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {isSkeletonShow ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <MailIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="60%" />
                ) : profile.email === null ? (
                  '......'
                ) : (
                  profile.email
                )
              }
              secondary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="40%" />
                ) : (
                  'Email Address'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {isSkeletonShow ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <PhoneAndroidIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="60%" />
                ) : profile.phone === null ? (
                  '......'
                ) : (
                  profile.phone
                )
              }
              secondary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="40%" />
                ) : (
                  'Phone'
                )
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />

          <ListItem>
            <ListItemIcon>
              {isSkeletonShow ? (
                <Skeleton variant="circle" width={40} height={40} />
              ) : (
                <LocationOnIcon />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="60%" />
                ) : profile.address === null ? (
                  '......'
                ) : (
                  profile.address
                )
              }
              secondary={
                isSkeletonShow ? (
                  <Skeleton variant="text" width="40%" />
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
  isSkeletonShow: false
};

export default UserDetailProfile;
