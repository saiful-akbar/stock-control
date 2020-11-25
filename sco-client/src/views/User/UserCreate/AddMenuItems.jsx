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
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
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
const AddMenuItems = (props) => {
  const { menuItems } = props.menus;
  const [rowData, setRowData] = useState([]);


  /**
   * Set state rowData untuk pertama
   */
  useEffect(() => {
    let newRowData = [];
    if (props.data.length > 0) {
      props.data.map(data => menuItems.map(menu => {
        if (menu.id === data.menu_item_id) {
          newRowData = [
            ...newRowData,
            {
              menu_i_title: menu.menu_i_title,
              id: data.id,
              user_id: data.user_id,
              menu_item_id: data.menu_item_id,
              user_m_i_create: data.user_m_i_create === true ? 'Yes' : 'No',
              user_m_i_read: data.user_m_i_read === true ? 'Yes' : 'No',
              user_m_i_update: data.user_m_i_update === true ? 'Yes' : 'No',
              user_m_i_delete: data.user_m_i_delete === true ? 'Yes' : 'No',
            }
          ];
        }
        return newRowData;
      }));
      setRowData(newRowData);
    }
    // eslint-disable-next-line
  }, []);


  /**
   * Handle next step
   */
  const handleNextStep = () => {
    let newData = [];
    rowData.map((row) => {
      newData = [
        ...newData,
        {
          id: row.id,
          user_id: row.user_id,
          menu_item_id: row.menu_item_id,
          user_m_i_create: row.user_m_i_create === 'Yes' ? true : false,
          user_m_i_read: row.user_m_i_read === 'Yes' ? true : false,
          user_m_i_update: row.user_m_i_update === 'Yes' ? true : false,
          user_m_i_delete: row.user_m_i_delete === 'Yes' ? true : false,
        }
      ];
      return newData;
    });
    props.setData(newData);
    props.nextStep();
  }


  /**
   * Valisasi set rew data
   * @param {data} data 
   */
  const validation = (data) => {
    let result = true;
    if (rowData.length > 0) {
      rowData.map((row) => {
        if (row.menu_item_id === data.menu_item_id) {
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
  const handleSubmitForm = (data, { resetForm }) => {
    resetForm({});
    let validate = validation(data);
    if (validate) {
      menuItems.map((menu) => {
        if (menu.id === data.menu_item_id) {
          setRowData([
            {
              menu_i_title: menu.menu_i_title,
              id: uuidv4(),
              user_id: props.user.id,
              menu_item_id: data.menu_item_id,
              user_m_i_create: data.user_m_i_create === true ? 'Yes' : 'No',
              user_m_i_read: data.user_m_i_read === true ? 'Yes' : 'No',
              user_m_i_update: data.user_m_i_update === true ? 'Yes' : 'No',
              user_m_i_delete: data.user_m_i_delete === true ? 'Yes' : 'No',
            },
            ...rowData,
          ])
        }
        return null;
      });
    } else {
      props.notification({
        show: true,
        type: 'error',
        message: 'The menu is already on the list'
      });
    }
  }


  return (
    <>
      <CardHeader
        title={<Typography variant='h6'>Menu items</Typography>}
        subheader='Add user menu items access'
      />

      <CardContent>
        <Animation type='slide' timeout={300} direction="right">
          <Formik
            initialValues={{
              menu_item_id: '',
              user_m_i_read: true,
              user_m_i_create: false,
              user_m_i_update: false,
              user_m_i_delete: false,
            }}

            validationSchema={Yup.object().shape({
              user_m_i_create: Yup.boolean(),
              user_m_i_read: Yup.boolean(),
              user_m_i_update: Yup.boolean(),
              user_m_i_delete: Yup.boolean(),
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
                    <Grid item xs={12}>
                      <FormControl
                        fullWidth
                        variant='outlined'
                      >
                        <InputLabel id='menu-items'>Menu Items</InputLabel>
                        <Select
                          label='Menu Items'
                          labelId='menu-items'
                          name='menu_item_id'
                          value={values.menu_item_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {menuItems.map((data, key) => (
                            <MenuItem key={key} value={data.id}>{data.menu_i_title}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControlLabel
                        label='Read'
                        control={
                          <Checkbox
                            name='user_m_i_read'
                            color='primary'
                            disabled={values.menu_item_id === '' ? true : false}
                            checked={values.user_m_i_read}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label='Create'
                        control={
                          <Checkbox
                            name='user_m_i_create'
                            color='primary'
                            disabled={values.menu_item_id === '' ? true : false}
                            checked={values.user_m_i_create}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label='Update'
                        control={
                          <Checkbox
                            name='user_m_i_update'
                            color='primary'
                            disabled={values.menu_item_id === '' ? true : false}
                            checked={values.user_m_i_update}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label='Delete'
                        control={
                          <Checkbox
                            name='user_m_i_delete'
                            color='primary'
                            disabled={values.menu_item_id === '' ? true : false}
                            checked={values.user_m_i_delete}
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
                        disabled={values.menu_item_id === '' ? true : false}
                        endIcon={
                          <PlusOneIcon />
                        }
                      >Add</Button>
                    </Grid>
                  </Grid>
                </form>
              )}
          </Formik>

          <Box mt={3}>
            <UserCreateTable
              columns={[
                { name: 'menu_i_title', label: 'Title' },
                { name: 'user_m_i_read', label: 'Read', align: 'center' },
                { name: 'user_m_i_create', label: 'Create', align: 'center' },
                { name: 'user_m_i_update', label: 'Update', align: 'center' },
                { name: 'user_m_i_delete', label: 'Delete', align: 'center' },
              ]}
              rows={rowData}
              action={(id) => {
                const newRowData = rowData.filter((value) => value.id !== id);
                setRowData(newRowData);
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
          onClick={props.backStep}
          startIcon={<ArrowBackIosIcon />}
        >Back</Button>

        <Button
          color='primary'
          variant='contained'
          disabled={rowData.length === 0 ? true : false}
          onClick={handleNextStep}
          endIcon={<ArrowForwardIosIcon />}
        >Next</Button>
      </Box>
    </>
  );
};


export default AddMenuItems;