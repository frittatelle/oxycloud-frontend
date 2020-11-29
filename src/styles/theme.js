import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette:{
        primary: {
            main: '#257cff',
            light: '#73aaff',
            dark:'#0051cb',
        },
        secondary:{
            main:'#ffa825',
            light:'#ffda5b',
            dark: '#c77900',
        }
    },
    typography:{
        fontFamily: "Inter",
    },
    shape:{
        borderRadius: 16,
    },
    overrides: {
        MuiIconButton:{
            root: {
                backgroundColor: '#257cff',  
                color: '#fff',
                '&:hover': {
                    backgroundColor: '#73aaff',
                },
                padding: 5,
                marginLeft: 32,
                marginRight:32,
            }
        },
    },
});

export default theme;