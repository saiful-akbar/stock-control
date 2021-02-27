import React, { useState, useEffect } from 'react';
import {
  Grid,
  CardContent,
  Divider,
  Box,
  Button,
  CardHeader,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  InputLabel,
  FormControl,
  Typography,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PlusOneIcon from '@material-ui/icons/PlusOne';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Animation from 'src/components/Animation';
import UserCreateTable from './UserCreateTable';
import { v4 as uuidv4 } from 'uuid';

/**
 * Main component
 */
const AddMenuSubItems = (props) => {
  const { menuSubItems, menuItems } = props.menus;
  const [rowData, setRowData] = useState([]);


  useEffect(() => {
    let newRowData = [];
    props.data.map((pd) => menuSubItems.map((msi) => {
      if (msi.id === pd.menu_sub_item_id) {
        newRowData = [
          ...newRowData,
          {
            menu_i_title: msi.menu_i_title,
            menu_s_i_title: msi.menu_s_i_title,
            id: pd.id,
            user_id: pd.user_id,
            menu_sub_item_id: pd.menu_sub_item_id,
            user_m_s_i_create: pd.user_m_s_i_create === true ? 'Yes' : 'No',
            user_m_s_i_read: pd.user_m_s_i_read === true ? 'Yes' : 'No',
            user_m_s_i_update: pd.user_m_s_i_update === true ? 'Yes' : 'No',
            user_m_s_i_delete: pd.user_m_s_i_delete === true ? 'Yes' : 'No',
          }
        ]
      }
      return newRowData;
    }));
    setRowData(newRowData);
  }, [props.data, menuSubItems, setRowData]);


  /**
   * Valisasi set rew data
   * @param {data} data 
   */
  const validation = (data) => {
    let result = true;
    if (props.data.length > 0) {
      props.data.map((pd) => {
        if (pd.menu_sub_item_id === data.menu_sub_item_id) {
          result = false;
        }
        return result;
      })
    }
    return result;
  }


  /**
   * Handle submit form
   */
  const handleSubmitForm = (data, { resetForm, setFieldValue }) => {
    resetForm({});
    setFieldValue('menu_item_id', data.menu_item_id);
    let validate = validation(data);
    if (validate) {
      props.setData([
        {
          id: uuidv4(),
          user_id: props.user.id,
          menu_sub_item_id: data.menu_sub_item_id,
          user_m_s_i_create: data.user_m_s_i_create,
          user_m_s_i_read: data.user_m_s_i_read,
          user_m_s_i_update: data.user_m_s_i_update,
          user_m_s_i_delete: data.user_m_s_i_delete,
        },
        ...props.data
      ]);
    } else {
      props.notification({
        show: true,
        type: 'error',
        message: 'The menu is already on the list'
      });
    }
  }


  /**
   * Handle save
   */
  const handleSave = () => {
    props.save();
  }


  return (
    <>
      <CardHeader
        title={<Typography variant='h6'>Menu sub items</Typography>}
        subheader='Add user menu sub items access'
      />

      <CardContent>
        <Animation type='slide' timeout={300} direction="right">
          <Formik
            initialValues={{
              menu_item_id: '',
              menu_sub_item_id: '',
              user_m_s_i_read: true,
              user_m_s_i_create: false,
              user_m_s_i_update: false,
              user_m_s_i_delete: false,
            }}

            validationSchema={Yup.object().shape({
              user_m_s_i_create: Yup.boolean(),
              user_m_s_i_read: Yup.boolean(),
              user_m_s_i_update: Yup.boolean(),
              user_m_s_i_delete: Yup.boolean(),
            })}

            onSubmit={handleSubmitForm}
          >
            {({
              handleBlur,
              handleChange,
              handleSubmit,
              values,
            }) => (
                <form onSubmit={handleSubmit} noValidate autoComplete='off' >
                  <Grid
                    container
                    spacing={3}
                    direction='row'
                    justify='space-around'
                    alignItems='center'
                  >
                    <Grid item md={6} xs={12}>
                      <FormControl fullWidth variant='outlined' >
                        <InputLabel id='menu-items'>Menu Items</InputLabel>
                        <Select
                          labelId='menu-items'
                          name='menu_item_id'
                          label='Menu Items'
                          value={values.menu_item_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value='' disabled>None</MenuItem>
                          {props.userMenuItems.map((umi, umiKey) => menuItems.map((mi, miKey) => {
                            if (mi.id === umi.menu_item_id && mi.menu_i_children === 1) {
                              return (
                                <MenuItem
                                  key={miKey}
                                  value={mi.id}
                                >
                                  {mi.menu_i_title}
                                </MenuItem>
                              )
                            }
                            return null;
                          }))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item md={6} xs={12}>
                      <FormControl fullWidth variant='outlined' >
                        <InputLabel id='menu-sub-items'>Menu Sub Items</InputLabel>
                        <Select
                          labelId='menu-sub-items'
                          name='menu_sub_item_id'
                          label='Menu Sub Items'
                          value={values.menu_sub_item_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <MenuItem value='' disabled>None</MenuItem>
                          {menuSubItems.map((msi, msiKey) => {
                            if (msi.menu_item_id === values.menu_item_id) {
                              return (
                                <MenuItem
                                  key={msiKey}
                                  value={msi.id}
                                >
                                  {msi.menu_s_i_title}
                                </MenuItem>
                              )
                            }
                            return null;
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Read'
                        control={
                          <Checkbox
                            name='user_m_s_i_read'
                            color='primary'
                            disabled={values.menu_sub_item_id === '' ? true : false}
                            checked={values.user_m_s_i_read}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label='Create'
                        control={
                          <Checkbox
                            name='user_m_s_i_create'
                            color='primary'
                            disabled={values.menu_sub_item_id === '' ? true : false}
                            checked={values.user_m_s_i_create}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label='Update'
                        control={
                          <Checkbox
                            name='user_m_s_i_update'
                            color='primary'
                            disabled={values.menu_sub_item_id === '' ? true : false}
                            checked={values.user_m_s_i_update}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label='Delete'
                        control={
                          <Checkbox
                            name='user_m_s_i_delete'
                            color='primary'
                            disabled={values.menu_sub_item_id === '' ? true : false}
                            checked={values.user_m_s_i_delete}
                            onChange={handleChange}
                          />
                        }
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        color='primary'
                        variant='contained'
                        type='submit'
                        disabled={values.menu_sub_item_id === '' ? true : false}
                        endIcon={<PlusOneIcon />}
                      >Add</Button>
                    </Grid>
                  </Grid>
                </form>
              )}
          </Formik>

          <Box mt={3}>
            <UserCreateTable
              columns={[
                { name: 'menu_i_title', label: 'Menu Item' },
                { name: 'menu_s_i_title', label: 'Menu Sub Item' },
                { name: 'user_m_s_i_read', label: 'Read', align: 'center' },
                { name: 'user_m_s_i_create', label: 'Create', align: 'center' },
                { name: 'user_m_s_i_update', label: 'Update', align: 'center' },
                { name: 'user_m_s_i_delete', label: 'Delete', align: 'center' },
              ]}
              rows={rowData}
              action={(id) => {
                const newData = props.data.filter((data) => data.id !== id);
                props.setData(newData);
              }}
            />
          </Box>
        </Animation>
      </CardContent>

      <Divider />
      <Box display='flex' justifyContent='flex-end' p={2} >
        <Button
          color='primary'
          variant='outlined'
          type='button'
          style={{ marginRight: 20 }}
          disabled={props.loading}
          onClick={props.backStep}
          startIcon={<ArrowBackIosIcon />}
        >
          {'Back'}
        </Button>

        <Button
          color='primary'
          variant='contained'
          disabled={props.loading}
          onClick={handleSave}
          startIcon={<SaveIcon />}
        >
          {'Save'}
        </Button>
      </Box>
    </>
  );
};


export default AddMenuSubItems;