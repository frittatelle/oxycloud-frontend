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
        MuiAvatar:{
            colorDefault:{
                backgroundColor: '#257cff',  
                color: '#fff',
                '&:hover': {
                    backgroundColor: '#73aaff',
                },
            },
        },
        MuiListItem:{
            root:{
                paddingTop: 15,
                paddingBottom: 15,
            }   
        }
    },
});

export default theme;