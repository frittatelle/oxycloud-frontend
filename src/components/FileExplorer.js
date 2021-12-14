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

//modal
import Modal from "@material-ui/core/Modal";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useState } from 'react'


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
const ShareModal = ({open, handleClose, shareParams}) => {
    const [userMail, setUserMail] = useState("");
    const share = ()=>{
        OxySession.storage.share(shareParams.id, userMail);
        setUserMail("");
    }
    const delShare = ()=>{
    }
    return (
        <Modal
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            open={open}
            onClose={handleClose}>
              <Card align="left" style={{minWidth: 275}}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Share '{shareParams.name}' with ... 
                    </Typography>
                    <form noValidate autoComplete="off">
                      <TextField value={userMail} label="email" variant="outlined" 
                        onChange={(e)=>{setUserMail(e.target.value)}}/>
                    </form>
                    <CardActionArea>
                        <Button disabled={userMail===""} size="small" onClick={()=>share()}>Confirm</Button>
                    </CardActionArea>
              </CardContent>
              </Card>
        </Modal>
   )
}


const FileExplorer = ({ classes, folder, setFolder }) => {
  const FSTree = useQuery(["fsTree", folder], () => OxySession.storage.ls(folder))
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareParams, setShareParams] = useState({name:"", id:""});

  const handleShareModalClose = () => setShareModalOpen(false);

  const startDownload = ({id,name}) => OxySession.storage.get(id)
      .then((res) => saveByteArray(name, res.content_type, res.body))
      .catch(console.error);
  

  const rm = (id) => OxySession.storage.rm(id);

  const shareDialog = (params) => {
    console.log("Sharing:", params);
    setShareParams(params);
    setShareModalOpen(true);
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
            on_rm={rm}
          />
          
        }
      </Grid>
        <ShareModal 
            shareParams={shareParams} 
            open={shareModalOpen} 
            handleClose={handleShareModalClose} />
    </Container>
  );
}
export default withStyles(useStyles)(FileExplorer);
