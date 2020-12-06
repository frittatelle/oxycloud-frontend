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

import FileTable from './FileExplorer/FileTable'
import FoldersBar from './FileExplorer/FoldersBar'

const useStyles = theme => ({
   allarga:{
       margin: 0,
       maxWidth:"100%",
  },
    cont:{
        // width:`calc(100% - ${drawerWidth}px)`,
        maxWidth:"100%",
        marginLeft:0,
        marginRight:0,
        paddingLeft:0,
      paddingRight: 0,
  }
});

function saveByteArray(fileName, contentType, byte) {
  var blob = new Blob([byte], {type: contentType});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};

const FileExplorer = ({ api, classes, folder }) => {
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


  function startDownload({ Key, Name }) {
    console.log("Download:", Key);
    api.getObject({
      Key: Key,
      Bucket: "test-bucket"
    },
      (err, res) => {
        if (err) throw err;
        saveByteArray(Name, res.contentType, res.Body)
      })
  }

  function shareDialog(row) {
    console.log("Sharing:", row.Key);
  }

  function _getFilesList() {
    setLoading(true);
    api.listObjects({
      Prefix: currentFolder,
      Delimiter: "/",
      Bucket: "test-bucket"
    }).promise()
      .then(_processApiResponse)
      .catch((err) => {
        setError(err.toString());
        setLoading(false);
      });
  }

  function _processApiResponse(data) {

    setFiles(data.Contents.map((f) => {
      f.Name = f.Key.split('/');
      f.Name = f.Name[f.Name.length - 1];
      f.startDownload = startDownload;
      return f;
    }));

    setFolders(data.CommonPrefixes.map((f) => {
      f.Name = f.Prefix.split('/');
      // it ends with / then the split contains a empty string as last element
      f.Name = f.Name[f.Name.length - 2] + "/";
      f.setCurrentFolder = setCurrentFolder;
      return f;
    }));

    //setTimeout(()=> //to delay response
    //console.log(files, folders)
    setError("");
    setLoading(false);
    //, 3000);
  }

  return (
      <Container className={classes.cont} >
        <AppBar position='sticky' color='inherit' className={classes.allarga}>
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
              files={files}
              folders={folders}
              setCurrentFolder={setCurrentFolder}
              onDownload={startDownload}
              onSharing={shareDialog}
            />
          }
        </Grid>
      </Container>
  );
}
export default withStyles(useStyles)(FileExplorer)