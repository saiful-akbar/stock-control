import React from 'react';
import { connect } from 'react-redux';
import Page from 'src/components/Page';
import { Grid, Typography, Paper, Box, Card, Button } from '@material-ui/core';

const Dashboard = (props) => {
  return (
    <Page
      title="Dashboard"
      pageTitle='Dashboard'
    >
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'}>
            <Box p={2}>
              <Button color='primary' variant='contained' style={{ margin: 2 }}>Primary</Button>
              <Button color='secondary' variant='contained'>Secondary</Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'} elevation={1}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'} elevation={2}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'} elevation={3}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Card variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'} elevation={1}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'} elevation={2}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card variant={props.reduxTheme === 'dark' ? 'outlined' : 'elevation'} elevation={3}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};


/**
 * Redux state
 */
function reduxState(state) {
  return {
    reduxTheme: state.theme
  }
}


export default connect(reduxState, null)(Dashboard);
