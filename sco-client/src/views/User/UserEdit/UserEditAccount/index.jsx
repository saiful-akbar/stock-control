import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
} from '@material-ui/core';
import BtnSubmit from 'src/components/BtnSubmit';


/**
 * Komponen utama
 * @param {*} props 
 */
function UserEditAccount(props) {
  return (
    <Card
      variant={
        props.redusTheme === 'dark'
          ? 'outlined'
          : 'elevation'
      }
      elevation={3}
    >
      <CardHeader
        title="Account"
        subheader="Change the account for user authentication"
      />

      <CardContent>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus quos deleniti delectus beatae quas totam similique quae, doloremque vero reiciendis consectetur excepturi explicabo quod asperiores, possimus error aspernatur debitis qui.
      </CardContent>

      <Box
        display='flex'
        justifyContent='flex-end'
        p={2}
      >
        <BtnSubmit
          title='Save'
          variant='contained'
          style={{
            marginLeft: 10
          }}
        />
      </Box>
    </Card>
  )
}


/**
 * Tipe properti untuk komponen UserEditAccount
 */
UserEditAccount.propsTypes = {
  userId: PropTypes.string.isRequired,
};


/**
 * Redux state
 * @param {obj} state 
 */
function reduxState(state) {
  return {
    redusTheme: state.theme
  }
}


export default connect(reduxState, null)(UserEditAccount);