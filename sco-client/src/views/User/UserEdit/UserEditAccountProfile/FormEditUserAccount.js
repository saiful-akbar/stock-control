import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import CustomTooltip from 'src/components/CustomTooltip';
import { Skeleton } from '@material-ui/lab';

/* Komponen utama */
function FormEditAccount({
  loading,
  values,
  handleBlur,
  handleChange,
  touched,
  errors,
  isSkeletonShow
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Card elevation={3}>
      <CardHeader
        title={
          isSkeletonShow ? (
            <Skeleton variant="text" width="30%" />
          ) : (
            'Account Form'
          )
        }
        subheader={
          isSkeletonShow ? (
            <Skeleton variant="text" width="50%" />
          ) : (
            'Account data will be used as user authentication'
          )
        }
      />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
            {isSkeletonShow ? (
              <Skeleton variant="rect" height={54} />
            ) : (
              <TextField
                fullWidth
                required
                label="Username"
                name="username"
                type="text"
                variant="outlined"
                disabled={loading}
                value={values.username}
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
              />
            )}
          </Grid>

          <Grid item md={5} xs={12}>
            {isSkeletonShow ? (
              <Skeleton variant="rect" height={54} />
            ) : (
              <TextField
                fullWidth
                label="Password"
                name="password"
                variant="outlined"
                autoComplete="off"
                type={showPassword ? 'text' : 'password'}
                disabled={loading}
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                error={Boolean(touched.password && errors.password)}
                helperText={
                  Boolean(errors.password)
                    ? errors.password
                    : "Leave the password blank if you don't want to change it"
                }
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {values.password !== '' && (
                        <CustomTooltip
                          placement="bottom"
                          title={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          <IconButton
                            color="primary"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <VisibilityOutlinedIcon />
                            ) : (
                              <VisibilityOffOutlinedIcon />
                            )}
                          </IconButton>
                        </CustomTooltip>
                      )}
                    </InputAdornment>
                  )
                }}
              />
            )}
          </Grid>

          <Grid item md={2} xs={12}>
            {isSkeletonShow ? (
              <Skeleton variant="rect" height={54} />
            ) : (
              <FormControlLabel
                label="Is Active"
                control={
                  <Switch
                    name="is_active"
                    color="primary"
                    checked={values.is_active}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FormEditAccount;
