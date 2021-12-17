import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'

const FoldersBar = ({ currentFolder, setCurrentFolder, rootFolder }) => {
  const f = (currentFolder+"/").split('/');
  var folders = [];
   
  folders.push(
    <Link color='inherit' key="" full_path=""
      onClick={(arg) => {
        setCurrentFolder(arg.target.attributes['full_path'].value)
      }} >
        {rootFolder==="FOLDER" && 'My folder'}
        {rootFolder==="TRASH" && 'Trash'}
        {rootFolder==="SHARED" && 'Shared with me'}
        </Link>
  );
  for (var i = 0; i < f.length - 1; i++) {
    var tmp = f.slice(0, i + 1).join("/") ;
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

export default FoldersBar;
