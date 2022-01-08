import { makeStyles } from '@material-ui/core/styles';

//React
import { useState } from 'react';

//Components
import Header from './Header';
import SideBar from './SideBar';
import FileExplorer from './FileExplorer'


// Temporatry style, put this style in the actual components!
const useStyles = makeStyles(theme => ({
  local_root: {
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

function App(props) {
  //Temporary state management to open/close the drawer
  // CHANGE IT TO A SMARTER SOLUTION!
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState({id:"",name:""});
  //My folder || Trash || Shared with me
  const [rootFolder, setRootFolder] = useState("FOLDER");
  
  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }
  const classes = useStyles();
  return (
    <div className={classes.local_root}>
      <Header 
        handleSidebar={handleSidebar} 
        sidebarOpen={sidebarOpen} 
        folder={currentFolder} 
        rootFolder={rootFolder}
        signOut={props.doSignOut}
      />
      <SideBar 
        sidebarOpen={sidebarOpen} 
        rootFolder={rootFolder} 
        setRootFolder={setRootFolder} 
      />
      <main className={classes.content}>
        <FileExplorer 
            maxWidth="lg" 
            folder={currentFolder} 
            setFolder={setCurrentFolder} 
            rootFolder={rootFolder}
        />
      </main>
    </div>
  );
}

export default App;
