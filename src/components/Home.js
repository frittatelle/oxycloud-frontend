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


function App() {
  //Temporary state management to open/close the drawer
  // CHANGE IT TO A SMARTER SOLUTION!
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState("");
  const handleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log(sidebarOpen);
  }
  const classes = useStyles();

  return (
    <div className={classes.local_root}>
      <Header handleSidebar={handleSidebar} sidebarOpen={sidebarOpen} folder={currentFolder} />
      <SideBar sidebarOpen={sidebarOpen} folder={currentFolder} setFolder={setCurrentFolder} />
      {/* Temporary container , make a new component!, insert Toolbar component for spacing!*/}
      <main className={classes.content}>
        <FileExplorer maxWidth="lg" folder={currentFolder} setFolder={setCurrentFolder} />
      </main>
    </div>
  );
}

export default App;
