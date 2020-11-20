import React from 'react';
import {
  IconButton,
} from '@material-ui/core';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import Brightness2OutlinedIcon from '@material-ui/icons/Brightness2Outlined';
import { connect } from 'react-redux';
import { reduxAction } from 'src/config/redux/state';
import { useCookies } from 'react-cookie';
import CustomTooltip from 'src/components/CustomTooltip';

const ThemeMode = ({ setReduxTheme, reduxTheme, ...props }) => {
  const [cookies, setCookie] = useCookies();
  const [darkMode, setDarkMode] = React.useState(false);
  const date = new Date();
  date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));

  React.useEffect(() => {
    cookies.theme === 'dark' ? setDarkMode(true) : setDarkMode(false);
  }, [cookies.theme]);

  const handleDarkMode = () => {
    if (darkMode) {
      setCookie('theme', 'light', { path: '/', expires: date });
      setReduxTheme('light');
    } else {
      setCookie('theme', 'dark', { path: '/', expires: date });
      setReduxTheme('dark');
    }
    setDarkMode(!darkMode);
  };

  return (
    <CustomTooltip title={reduxTheme === 'dark' ? 'Change to light mode' : 'Change to dark mode'}>
      <IconButton onClick={handleDarkMode} {...props}>
        {reduxTheme === 'dark' ? <WbSunnyOutlinedIcon /> : <Brightness2OutlinedIcon />}
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
