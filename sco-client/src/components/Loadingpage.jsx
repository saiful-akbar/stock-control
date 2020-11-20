import React from 'react';
import { makeStyles } from '@material-ui/core';
import {
    Backdrop,
    LinearProgress
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        zIndex: theme.zIndex.drawer + 1,
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.background.dark
    },
}));

const LoadingPage = ({ open, ...props }) => {
    const classes = useStyles();
    return (
        <Backdrop className={classes.root} open={open}>
            <LinearProgress color="primary" style={{ width: '50%' }} />
        </Backdrop>
    );
};

export default LoadingPage;