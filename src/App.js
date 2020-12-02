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
import FileExplorer from './components/FileExplorer'

//AWS API
import AWS from 'aws-sdk'


var s3_config = {
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER',
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint('http://localhost:4568')
}


// Temporatry style, put this style in the actual components!
const useStyles = makeStyles(theme => ({
  root:{
    display: 'flex',

  },
  content: {
    paddingTop:theme.spacing(8),
    flexGrow: 10,
    height: "100vh",
    overflow: "auto",
    position:"relative"
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
  const api = new AWS.S3(s3_config);
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
          <FileExplorer maxWidth="lg" currentFolder="" api={api}/>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
