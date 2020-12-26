import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link'
import {faFolderOpen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';

const FolderRow = ({ path, name, on_share: share, on_change_folder: change_folder }) => {
  return (
    <TableRow key={path}>
      <TableCell ><FontAwesomeIcon className="myicon" icon={faFolderOpen}></FontAwesomeIcon></TableCell>
      <TableCell component="th" scope="row">
        <Link color="inherit" onClick={() => change_folder(path)}>{name}</Link>
      </TableCell>

      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">
        <IconButton onClick={() => share(null)}><ShareIcon fontSize='small' /></IconButton>
      </TableCell>
    </TableRow>
  )
}
export default FolderRow;