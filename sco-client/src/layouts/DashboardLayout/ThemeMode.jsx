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
  const date = new Date();


  /**
   * Fungsi handle saat button theme di klik
   * @param {*} theme 
   */
  const handleDarkMode = (theme) => {

    // simpan pada redux theme
    setReduxTheme(theme);

    // Set cookie    
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
    cookies.set('theme', theme, { path: '/', expires: date });

    // ubah class pada tag body
    document.querySelector("body").classList.toggle("dark");
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
