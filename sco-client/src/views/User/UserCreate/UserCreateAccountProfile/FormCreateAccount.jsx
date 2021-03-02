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
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import CustomTooltip from 'src/components/CustomTooltip';

/* Komponen utama */
function FormCreateAccount({
  loading,
  values,
  handleBlur,
  handleChange,
  touched,
  errors,
  ...props
}) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Card variant="outlined">
      <CardHeader title="Account Form" />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item md={5} xs={12}>
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
          </Grid>

          <Grid item md={5} xs={12}>
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              disabled={loading}
              value={values.password}
              onBlur={handleBlur}
              onChange={handleChange}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <CustomTooltip
                      placement="bottom"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </CustomTooltip>
                  </InputAdornment>
                )
              }}
            />
          </Grid>

          <Grid item md={2} xs={12}>
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default FormCreateAccount;
