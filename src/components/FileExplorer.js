import {useState,Component,React} from 'react'; 
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
import Delete from '@material-ui/icons/Delete';
import ImageIcon from '@material-ui/icons/Image';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Header from './Header';
import SideBar from './SideBar';
import AWS from 'aws-sdk'
//icons
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress'

import { makeStyles } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../styles/theme';


var s3_config = {
  s3ForcePathStyle: true,
  accessKeyId: 'S3RVER',
  secretAccessKey: 'S3RVER',
  endpoint: new AWS.Endpoint('http://localhost:4568')
}



const drawerWidth = 240;
// Temporatry style, put this style in the actual components!


const useStyles = theme => ({
  root:{
    display: 'flex',
      
  },
  content: {
    paddingTop:theme.spacing(8),
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
    
    for(var i=0; i<mapping.image.length; i++) {
       
       
  if(mapping.image[i]===(ext))
      if(ext=="png"||ext=="gif"||ext=="jpg"){
        return( <ImageIcon />  
               )
      }
               if(ext=="txt"|| ext=="pdf"||ext=="docx"){
            return(
            <InsertDriveFileIcon />
            )
        }
     console.log("value",ext)
        
        //console.log("image",Icons.image[i])
   // return Icons.image[j];
        
         /* if(ext=="png")
               return (
      <ImageIcon />
                   )
      if(ext=="txt")
          return(
          <InsertDriveFileIcon  />
          )
       */
      
      //Icons.image[0];
        
         
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
};

const {sidebarOpen,setSidebarOpen}=()=>{
useState='false';
}
const handleSidebar = (setSidebarOpen) => {
  setSidebarOpen(!sidebarOpen);
  console.log(sidebarOpen);
}

 class FileTable extends Component{
  constructor(props){
    super(props);
    this.api = props.api;
    this.state = {
      currentFolder: props.currentFolder || "",
      sidebarOpen,setSidebarOpen : 'false',
      loading: true,
      files: null,
      folders: null
    };
   
    
  }
  componentDidMount(){
    this._getFilesList();
  }
    

  componentDidUpdate(prevProp, prevState, snapshot){
    //super.componentDidUpdate(prevProp, prevState, snapshot);
    if(prevState.currentFolder !== this.state.currentFolder){
      this.setState({loading:true});
      this._getFilesList();
    }
  }

  _getFilesList(){    
    // this.api.listObjects({
    //   Prefix: this.state.currentFolder,
    //   Delimiter: "/",
    //   Bucket: "test-bucket"
    // },this._processApiResponse.bind(this));
  }
  _processApiResponse(err,data){
    //console.log(data);
    if(err) {
        
      this.setState({loading:false, error:err.toString()});
      return;
    }
    var files = data.Contents.map((f)=>{
      f.Name = f.Key.split('/');
      f.Name = f.Name[f.Name.length-1];
      return f;
    });
    var folders = data.CommonPrefixes.map((f)=>{
      f.Name = f.Prefix.split('/');
      // it ends with / then the split contains a empty string as last element
      f.Name = f.Name[f.Name.length-2] + "/";
      return f;
    });
    //setTimeout(()=> //to delay response
      console.log(files,folders)
    this.setState({
      files: files,
      folders: folders,
      loading: false
    })
    //, 3000);
  }
  startDownload(row){
    console.log("Download:", row.Key);
    this.api.getObject({
      Key:row.Key,
      Bucket: "test-bucket"},
      (err,res)=>{
        if(err) throw err;
        saveByteArray(row.Name,res.contentType,res.Body)        
      })
  }
    
  
    shareDialog(row){
    console.log("Sharing:", row.Key)
  }

  renderFileRow(row){
      const { classes } = this.props;
      
    return (
      <TableRow key={row.Key} >
        <TableCell>
        <div > {getIcon(row.Name.split('.').pop())} </div>
        </TableCell>
      
        <TableCell component="th">
        {row.Name}
      </TableCell>
         
      
      <TableCell  align="right">{getReadableFileSizeString(row.Size)}
            
            </TableCell>
      <TableCell  align="right">{row.Owner.DisplayName}</TableCell>
      <TableCell  align="right">{formatDate(new Date(row.LastModified))}</TableCell>
           
      <TableCell  align="right">
        <IconButton onClick={()=>this.startDownload(row)}><GetAppIcon fontSize='small'/></IconButton>
        <IconButton onClick={()=>this.shareDialog(row)}><ShareIcon fontSize='small' /></IconButton>
            
      </TableCell>
    </TableRow>
    )
  }
  Sidebar() {
    
    const api = new AWS.S3(s3_config);
    //Temporary state management to open/close the drawer 
    // CHANGE IT TO A SMARTER SOLUTION!
   
    return (
      <ThemeProvider theme={theme}>
        <div className={useStyles.root}>
          <CssBaseline />
          <Header handleSidebar= {handleSidebar} sidebarOpen={sidebarOpen} />
          <SideBar sidebarOpen={sidebarOpen}/>
        </div>
      </ThemeProvider>
    );
  }
  renderFolderRow(row){
    return (
      <TableRow key={row.Prefix}>
      <TableCell component="th" scope="row">
        <Link color="inherit" onClick={()=>this.setState({currentFolder:row.Prefix})}>{row.Name}</Link>
      </TableCell>
   
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">
        <IconButton onClick={()=>this.shareDialog(row)}><ShareIcon fontSize='small' /></IconButton>
      </TableCell>
    </TableRow>
    )
  }

  renderTable() {
    if(this.state.loading){
      return (<Grid container justify="center"><CircularProgress align='center' /></Grid>)
    }
    if(this.state.error){
      return (
      <Grid containerjustify="center">
        <Typography color="error" align="center">{this.state.error}</Typography>
      </Grid>
      )
    }
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead >
            <TableRow>
              
              <TableCell></TableCell>
               <TableCell  >Name</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Owner</TableCell>
              <TableCell align="right">Last modified</TableCell>
              <TableCell align="right">&nbsp;</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.folders.map((row) => (
                this.renderFolderRow(row)
            ))}
            {this.state.files.map((row) => (
                this.renderFileRow(row)
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
  renderToolbarBody(){
    const f = this.state.currentFolder.split('/');
    var folders = [];
    
    folders.push(<Link color='inherit' full_path="" 
    onClick={(arg)=>this.setState({currentFolder:arg.target.attributes['full_path'].value})} >
      My folder
    </Link>);
    for (var i = 0; i < f.length-1; i++){
      var tmp = f.slice(0,i+1).join("/") +"/";
      folders.push(
        <Link color='inherit' full_path={tmp}
          onClick={(arg)=>this.setState({currentFolder:arg.target.attributes['full_path'].value})}>
         {f[i]}
        </Link>
      )
    }
    
    return (
      <Breadcrumbs aria-label="breadcrumb">
        {folders.map((v,i)=>{
        return v
        })}&nbsp;
      </Breadcrumbs>
    )
  }
  
  render(){
      const { classes } = this.props;
    //return (<Container>{this.renderToolbarBody()}{this.renderTable()} </Container>)
    return (
      <Container className={classes.cont} >
        <AppBar position='sticky' color='inherit' className={classes.allarga}>
          {this.Sidebar()}
          <Toolbar>
            {this.renderToolbarBody()}
          </Toolbar>
        </AppBar>
        {this.renderTable()}
      </Container>
    );
  }

}
export default withStyles(useStyles)(FileTable)