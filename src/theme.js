import { createTheme } from '@material-ui/core/styles';
import { red, white } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#f',
      darker: '#F9F9F9',
      lighter: '#ffffff',
    },
    secondary: {
      main: '#d32f2f',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fafafa',
    },
    text:{
      title:'#000000',
      lighter: "#969696",
    },
    white: {
      default: '#FFFFFF',
    },
  },
  menuItem:{
    color: '#000000',
    opacity: 0.5,
  }
});

const themeTwo = createTheme({
  palette: {
    primary: {
      main: '#2c2c2e',
      darker: '#161617',
      lighter: '#969696',
    },
    secondary: {
      main: '#4259d4',
      brighter: "#526dff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#161617',
    },
    text: {
      title: '#FFFFFF',
      lighter: "#969696",
    },
    white: {
      default: '#FFFFFF',
    },
  },
  menuItem:{
    color: '#FFFFFF',
    opacity: 0.9,
  }

});

export {theme, themeTwo};