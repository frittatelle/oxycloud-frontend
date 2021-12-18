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
import { useState, useEffect } from 'react'


const useStyles = () => ({
  cont: {
    maxWidth: "100%",
    marginLeft: 0,
    marginRight: 0,
    paddingLeft: 0,
    paddingRight: 0
  }
});

function saveByteArray(fileName, contentType, bytes) {
  var blob = new Blob([bytes], { type: contentType });
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
        handleClose();
    }
    // eslint-disable-next-line
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
                        Share '{shareParams.name}' with... 
                    </Typography>
                    <form noValidate autoComplete="off">
                      <TextField value={userMail} label="email" variant="outlined" 
                        onChange={(e)=>{setUserMail(e.target.value)}}/>
                    </form>
                    <CardActionArea>
                        <Button 
                            disabled={userMail===""} 
                            size="small" 
                            onClick={share}>Confirm</Button>
                    </CardActionArea>
              </CardContent>
              </Card>
        </Modal>
   )
}

const RenameModal = ({open, handleClose, renameParams}) => {
    const [newName, setNewName] = useState("");
    const rename = ()=>{
        OxySession.storage.rename(renameParams.id, newName);
        setNewName("");
        handleClose();
    }
    return (
        <Modal
            style={{display:'flex',alignItems:'center',justifyContent:'center'}}
            open={open}
            onClose={handleClose}>
              <Card align="left" style={{minWidth: 275}}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Rename '{renameParams.name}' as... 
                    </Typography>
                    <form noValidate autoComplete="off">
                      <TextField value={newName} label="new name" variant="outlined" 
                        onChange={(e)=>{setNewName(e.target.value)}}/>
                    </form>
                    <CardActionArea>
                        <Button 
                            disabled={newName===""} 
                            size="small" 
                            onClick={rename}>Confirm</Button>
                    </CardActionArea>
              </CardContent>
              </Card>
        </Modal>
   )
}



const FileExplorer = ({ classes, folder, setFolder, rootFolder }) => {
  const FSTree = useQuery(["fsTree", folder], () => {
      switch(rootFolder){
        case 'FOLDER':
              return OxySession.storage.ls(folder.id,false)
        case 'TRASH':
              return OxySession.storage.ls(folder.id,true)
        case 'SHARED':
              return OxySession.storage.lsShared(folder.id)
        default:
              console.error("Invalid root folder");
              return {}
      }
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareParams, setShareParams] = useState({name:"", id:""});
  
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameParams, setRenameParams] = useState({name:"", id:""});

  const handleShareModalClose = () => setShareModalOpen(false);
  const handleRenameModalClose = () => setRenameModalOpen(false);

  const startDownload = ({id,name}) => OxySession.storage.get(id)
      .then((res) => saveByteArray(name, res.content_type, res.body))
      .catch(console.error);
  // eslint-disable-next-line
  useEffect(() => { FSTree.refetch() },[folder, rootFolder])

  const rm = (id) => { 
      if(rootFolder==="FOLDER"){
        OxySession.storage.rm(id);
      }else{
        OxySession.storage.rm(id, false, true);
      }
      FSTree.refetch();
  };

  const renameDialog = (params) => {
    console.log("Rename:", params);
    setRenameParams(params);
    setRenameModalOpen(true);
    FSTree.refetch();
  }

  const shareDialog = (params) => {
    console.log("Sharing:", params);
    setShareParams(params);
    setShareModalOpen(true);
  }

  return (
    <Container className={classes.cont}>
      <AppBar position='sticky' color='inherit'>
        <Toolbar>
          <FoldersBar 
            currentFolder={folder} 
            setCurrentFolder={setFolder} 
            rootFolder={rootFolder}/>
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
            on_rename={renameDialog}
            enable_rm={rootFolder==='FOLDER'||rootFolder==='TRASH'}
            enable_download={rootFolder==='FOLDER'||rootFolder==='SHARED'}
            enable_sharing={rootFolder==='FOLDER'}
            enable_rename={rootFolder==='FOLDER'}
          />
          
        }
      </Grid>
        <ShareModal 
            shareParams={shareParams} 
            open={shareModalOpen} 
            handleClose={handleShareModalClose} />
        <RenameModal 
            renameParams={renameParams} 
            open={renameModalOpen} 
            handleClose={handleRenameModalClose} />
    </Container>
  );
}
export default withStyles(useStyles)(FileExplorer);
