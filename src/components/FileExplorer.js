import React, { useState, useEffect } from 'react';
//components
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import ImageIcon from '@material-ui/icons/Image';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
//icons
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress'

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
        paddingRight:0,

},
    move:{
    marginRight:300,


}
});

const mapping = {'image':['png', 'gif',"txt", 'jpg'],
                'document':['docx', 'txt']
                 }
//const Icons = {'image':['ImageIcon','InsertDriveFileIcon']}

function getIcon(ext) {
  for (var i = 0; i < mapping.image.length; i++) {
    if(mapping.image[i]===(ext))
      if(ext==="png"||ext==="gif"||ext==="jpg"){
        return <ImageIcon />
      }
    if(ext==="txt"|| ext==="pdf"||ext==="docx"){
      return <InsertDriveFileIcon />
    }
  }
}


function getReadableFileSizeString(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [' kiB', ' MiB', ' GiB', ' TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
  } while (fileSizeInBytes > 1024);

  return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};



function saveByteArray(fileName, contentType, byte) {
  var blob = new Blob([byte], {type: contentType});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
};



function formatDate(date) {
  //https://stackoverflow.com/a/25275914
  var year = date.getFullYear(),
      month = date.getMonth() + 1, // months are zero indexed
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
      minuteFormatted = minute < 10 ? "0" + minute : minute,
      morning = hour < 12 ? "am" : "pm";

  return  day + "/" + month + "/" + year + " " + hourFormatted + ":" +
          minuteFormatted + morning;
}

const FileRow = ({ Key, Name, Size, Owner, LastModified, startDownload, startSharing }) => {
  //console.log(startDownload)
  return (
    <TableRow key={Key} >
      <TableCell>
        <div > {getIcon(Name.split('.').pop())} </div>
      </TableCell>

      <TableCell component="th">
        {Name}
      </TableCell>


      <TableCell align="right">{getReadableFileSizeString(Size)}

      </TableCell>
      <TableCell align="right">{Owner.DisplayName}</TableCell>
      <TableCell align="right">{formatDate(new Date(LastModified))}</TableCell>

      <TableCell align="right">
        <IconButton onClick={() => startDownload({ Key, Name })}><GetAppIcon fontSize='small' /></IconButton>
        <IconButton onClick={() => startSharing({ Key, Name })}><ShareIcon fontSize='small' /></IconButton>

      </TableCell>
    </TableRow>
  )
}

const FolderRow = ({ Prefix, Name, startSharing, setCurrentFolder }) => {
  return (
    <TableRow key={Prefix}>
      <TableCell component="th" scope="row">
        <Link color="inherit" onClick={() => setCurrentFolder(Prefix)}>{Name}</Link>
      </TableCell>

      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => startSharing(null)}><ShareIcon fontSize='small' /></IconButton>
      </TableCell>
    </TableRow>
  )
}

const FoldersBar = ({ currentFolder, setCurrentFolder }) => {
  const f = currentFolder.split('/');
  var folders = [];

  folders.push(<Link color='inherit' key="" full_path=""
    onClick={(arg) => {
      setCurrentFolder(arg.target.attributes['full_path'].value)
    }} >
    My folder
  </Link>);
  for (var i = 0; i < f.length - 1; i++) {
    var tmp = f.slice(0, i + 1).join("/") + "/";
    folders.push(
      <Link color='inherit' key={tmp} full_path={tmp}
        onClick={(arg) => setCurrentFolder(arg.target.attributes['full_path'].value)}>
        {f[i]}
      </Link>
    )
  }

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {folders.map((v, i) => {
        return v
      })}&nbsp;
    </Breadcrumbs>
  )
}
const FileTable = ({ folders, files }) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell align="right">Size</TableCell>
            <TableCell align="right">Owner</TableCell>
            <TableCell align="right">Last modified</TableCell>
            <TableCell align="right">&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {folders.map((row) => <FolderRow {...row} />)}
          {files.map((row) => <FileRow {...row} />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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