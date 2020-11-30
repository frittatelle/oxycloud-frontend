//Styles
import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './styles/theme';

//React
import { useState } from 'react'; 

//Components
import Header from './components/Header';
import SideBar from './components/SideBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import FileExplorer from './components/FileExplorer'

// Temporatry style, put this style in the actual components!
const useStyles = makeStyles(theme => ({
  root:{
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
}));


function App() {

  //Temporary state management to open/close the drawer 
  // CHANGE IT TO A SMARTER SOLUTION!
  const [sidebarOpen,setSidebarOpen] = useState(false);
  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log(sidebarOpen);
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Header handleSidebar={handleSidebar} sidebarOpen={sidebarOpen} />
        <SideBar sidebarOpen={sidebarOpen}/>

        {/* Temporary container , make a new component!, insert Toolbar component for spacing!*/}
        <main className={classes.content}>
          <Toolbar />
          <Container maxWidth="lg" className={classes.container}>
            <FileExplorer currentFolder=""/>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
