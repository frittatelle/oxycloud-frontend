import React from 'react';
//components
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
//icons
import CircularProgress from '@material-ui/core/CircularProgress'

import { useQuery } from 'react-query';

//Oxycloud
import { OxySession } from "../utils/api"

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

const FileExplorer = ({ classes, folder, setFolder }) => {

  const FSTree = useQuery(["fsTree", folder], () => OxySession.storage.ls(folder))

  function startDownload({ path, name }) {
    console.log("Download:", path);
    OxySession.storage.get(path)
      .then((res) => saveByteArray(name, res.content_type, res.body))
      .catch(console.error)
  }

  function shareDialog(row) {
    console.log("Sharing:", row.Key);
  }

  return (
    <Container className={classes.cont}>
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <FoldersBar currentFolder={folder} setCurrentFolder={setFolder} />
        </Toolbar>
      </AppBar>
      <Grid container justify="center">
        {FSTree.isLoading && (<CircularProgress align='center' />)}
        {FSTree.error &&
          (<Typography color="error" align="center">ERROR:{FSTree.error}</Typography>)}
        {(!FSTree.isLoading && !FSTree.error) &&
          <FileTable
          folder={folder}
            on_change_folder={setFolder}
            on_download={startDownload}
            on_share={shareDialog}
          />
        }
      </Grid>
    </Container>
  );
}
export default withStyles(useStyles)(FileExplorer);