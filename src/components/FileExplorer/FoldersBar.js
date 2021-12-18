import Link from '@material-ui/core/Link'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
const makeListOfParent = (folder) =>{
    if(typeof folder === "undefined") return []
    const helper = (arr, folder) =>{
        arr.push(folder)
        if(folder.parent==="" 
            || typeof folder.parent === "undefined" 
            || folder.parent.id==="")
            return arr 
        return helper(arr, folder.parent)
    }
    let arr = helper([],folder)
    arr.reverse()
    return arr
}
const FoldersBar = ({ currentFolder, setCurrentFolder, rootFolder }) => {
  const f = makeListOfParent(currentFolder);
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
  f.forEach((fol)=> {
    folders.push(
      <Link color='inherit' id={fol.id} name={fol.name}
        onClick={(arg) => setCurrentFolder(fol)}>
        {fol.name}
      </Link>
    )
  });

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {folders.map((v, i) => {
        return v
      })}&nbsp;
    </Breadcrumbs>
  )
}

export default FoldersBar;
