import React from 'react';
//components
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import Fab from '@material-ui/core/Fab'
import { useTheme } from '@material-ui/core/styles'
//icons
import CircularProgress from '@material-ui/core/CircularProgress'
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import AddIcon from '@material-ui/icons/Add';

import { useQuery } from 'react-query';

//Oxycloud
import { OxySession } from "../utils/api"

import FileTable from './FileExplorer/FileTable'
import FoldersBar from './FileExplorer/FoldersBar'

//modal
import Modal from "./FileExplorer/Modals"

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify';

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

const FloatingButtons = ({currentFolder, onComplete, handleMkdirModalOpen}) => {
    const theme = useTheme();
    const handleNewFile = (evt) => {
        const [file] = evt.target.files;
        toast.promise(
             OxySession.storage.put(file, currentFolder.id)
            ,{
              pending: `Uploading ${file.name}`,
              success:{ 
                  render(){
                      onComplete();
                      return `${file.name} uploaded`
                  }
              }, 
              error:{
                    render({data}){
                        if(typeof data.message === "string")
                            return data.message
                        return JSON.stringify(data)
                    }
              }
        });
    }
    return (
        <div>
             <label htmlFor="addfile">
                <input id="addfile" 
                    name="addfile" 
                    type="file" 
                    onChange={handleNewFile}
                    hidden />
                <Fab size="medium" 
                    color="primary" 
                    component="span"
                    style={{
                        position: 'absolute',
                        bottom: theme.spacing(2),
                        right: theme.spacing(10),
                }}>
                    <AddIcon />
                </Fab>
            </label>
            <Fab size="medium" 
                color="primary"
                component="span"
                onClick={handleMkdirModalOpen}
                style={{
                    position: 'absolute',
                    bottom: theme.spacing(2),
                    right: theme.spacing(2),
            }}>
              <CreateNewFolderIcon />
              
            </Fab>
        </div>
    )
};


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
  
  const [mkdirModalOpen, setMkdirModalOpen] = useState(false);

  const startDownload = ({id,name}) => toast.promise(
            OxySession.storage.get(id)
            ,{
              pending: `Downloading ${name}`,
              success: {
                  render(res) {
                    saveByteArray(name, res.content_type, res.body)
                    return `${name} downloaded`
                  }
              },
              error:{
                    render({data}){
                        if(typeof data.message === "string")
                            return data.message
                        return JSON.stringify(data)
                    }
              }
        });

  // eslint-disable-next-line
  useEffect(() => { FSTree.refetch() },[folder, rootFolder])

  const rm = (id,name) => { 
      if(rootFolder==="FOLDER"){
        toast.promise(
            OxySession.storage.rm(id)
            ,{
              pending: `Moving ${name} to trash`,
              success: {
                  render() {
                    FSTree.refetch();
                    return `${name} moved to Trash`
                  }
              },
              error:{
                    render({data}){
                        if(typeof data.message === "string")
                            return data.message
                        return JSON.stringify(data)
                    }
              }
        });
      }else{
      toast.promise(
        OxySession.storage.rm(id, false, true)
        ,{
          pending: `Permanently deleting ${name}}`,
          success: {
              render() {
                FSTree.refetch();
                return `${name} permanently deleted`
              }
          }, 
          error:{
                render({data}){
                    if(typeof data.message === "string")
                        return data.message
                    return JSON.stringify(data)
                }
          }
        });
      }
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
      {rootFolder==="FOLDER" && <>
        <Modal.Share
            shareParams={shareParams} 
            open={shareModalOpen} 
            handleClose={handleShareModalClose} />
        <Modal.Rename
            renameParams={renameParams} 
            open={renameModalOpen} 
            handleClose={handleRenameModalClose} 
            onComplete={()=>FSTree.refetch()} />
        <Modal.MkDir 
            currentFolder={folder} 
            open={mkdirModalOpen} 
            handleClose={()=>setMkdirModalOpen(false)} 
            onComplete={()=>FSTree.refetch()} />

        <FloatingButtons 
            currentFolder={folder}
            handleMkdirModalOpen={()=>setMkdirModalOpen(true)}
            onComplete={()=>FSTree.refetch()} />
      </>}
    </Container>
  );
}
export default withStyles(useStyles)(FileExplorer);
