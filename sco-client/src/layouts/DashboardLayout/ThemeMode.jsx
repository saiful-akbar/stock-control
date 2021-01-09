import React from 'react';
import {
  IconButton,
} from '@material-ui/core';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import Brightness2OutlinedIcon from '@material-ui/icons/Brightness2Outlined';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import Cookies from 'universal-cookie';
import CustomTooltip from 'src/components/CustomTooltip';

const ThemeMode = ({ setReduxTheme, reduxTheme, ...props }) => {
  const cookies = new Cookies();


  const handleDarkMode = (theme) => {
    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    cookies.set('theme', theme, { path: '/', expires: date });
    setReduxTheme(theme);
  };


  return (
    <CustomTooltip
      title={
        reduxTheme === 'dark'
          ? 'Change to light mode'
          : 'Change to dark mode'}
    >
      <IconButton
        onClick={() => handleDarkMode(reduxTheme === 'light' ? 'dark' : 'light')}
        {...props}
      >
        {reduxTheme === 'dark'
          ? <WbSunnyOutlinedIcon />
          : <Brightness2OutlinedIcon />
        }
      </IconButton>
    </CustomTooltip>
  );
};

const reduxState = (state) => ({
  reduxTheme: state.theme,
});

const reduxReducer = (reducer) => ({
  setReduxTheme: (value) => reducer({ type: reduxAction.theme, value }),
});

export default connect(reduxState, reduxReducer)(ThemeMode);
