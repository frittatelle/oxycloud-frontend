import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './styles/theme';

//React
import { useState } from 'react';
import { ReactQueryDevtools } from 'react-query-devtools';

//Components
import Header from './components/Header';
import SideBar from './components/SideBar';
import FileExplorer from './components/FileExplorer'


// Temporatry style, put this style in the actual components!
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',

  },
  content: {
    paddingTop: theme.spacing(8),
    flexGrow: 380,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("");
  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className={classes.root}>
        <CssBaseline />
        <Header handleSidebar={handleSidebar} sidebarOpen={sidebarOpen} />
        <SideBar sidebarOpen={sidebarOpen} folder={currentFolder} setFolder={setCurrentFolder}/>

        {/* Temporary container , make a new component!, insert Toolbar component for spacing!*/}
        <main className={classes.content}>
          <FileExplorer maxWidth="lg" folder={currentFolder} setFolder={setCurrentFolder} />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;