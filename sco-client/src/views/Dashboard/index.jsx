import React from 'react';
import Page from 'src/components/Page';
import { Grid, Typography, Paper, Box, Card } from '@material-ui/core';

const Dashboard = () => {
  return (
    <Page
      title="Dashboard"
      pageTitle='Dashboard'
    >
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Paper>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={1}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={2}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={3}>
          <Paper elevation={3}>
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
          <Card>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card elevation={1}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card elevation={2}>
            <Box p={2}>
              <Typography>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Accusamus beatae laudantium maxime dignissimos laborum. Doloremque velit obcaecati pariatur deleniti qui recusandae magni ut enim nobis doloribus. Magni architecto pariatur modi.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={3}>
          <Card elevation={3}>
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

export default Dashboard;
