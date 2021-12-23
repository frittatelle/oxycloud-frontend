import React from 'react';

import Home from "./components/Home"
import Authorizer from './components/Authorizer.js'

import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './styles/theme';
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Authorizer>
            <Home />
        </Authorizer> 
      <ToastContainer position="top-right"/>
    </ThemeProvider>
  )
}
