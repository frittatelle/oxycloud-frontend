import React, { useState, useEffect } from 'react';
//components
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
//icons
import CircularProgress from '@material-ui/core/CircularProgress'


//Oxycloud
import { OxyStorage } from "../utils/api"

import FileTable from './FileExplorer/FileTable'
import FoldersBar from './FileExplorer/FoldersBar'

const useStyles = () => ({
  cont: {
    maxWidth: "100%",
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0
  }
});

function saveByteArray(fileName, contentType, byte) {
  var blob = new Blob([byte], { type: contentType });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  link.remove();
};

const FileExplorer = ({ classes, folder }) => {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [currentFolder, setCurrentFolder] = useState(folder || "");


  useEffect(_getFilesList, [currentFolder]);
  // this result in the following warning:
  //
  //React Hook useEffect has missing dependencies: '_processApiResponse' and 'api'.
  //Either include them or remove the dependency array  react-hooks/exhaustive-deps


  function startDownload({ path, name }) {
    console.log("Download:", path);
    OxyStorage.get(path)
      .then((res) => saveByteArray(name, res.content_type, res.body))
      .catch(setError)
  }

  function shareDialog(row) {
    console.log("Sharing:", row.Key);
  }

  function _getFilesList() {
    setLoading(true);
    OxyStorage.ls(currentFolder)
      .then(({ files, folders }) => {
        setFiles(files);
        setFolders(folders);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.toString());
        setLoading(false);
      });
  }


  return (
    <Container className={classes.cont}>
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <FoldersBar currentFolder={currentFolder} setCurrentFolder={setCurrentFolder} />
        </Toolbar>
      </AppBar>
      <Grid container justify="center">
        {loading === true && (<CircularProgress align='center' />)}
        {error !== "" &&
          (<Typography color="error" align="center">{error}</Typography>)}
        {(loading === false && error === "") &&
          <FileTable
          current_folder={currentFolder}
            files={files}
            folders={folders}
          on_change_folder={setCurrentFolder}
          on_download={startDownload}
          on_share={shareDialog}
          />
        }
      </Grid>
    </Container>
  );
}
export default withStyles(useStyles)(FileExplorer);