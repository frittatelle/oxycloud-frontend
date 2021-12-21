import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link'
import {faFolderOpen} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ShareIcon from '@material-ui/icons/Share';
import DeleteIcon from '@material-ui/icons/Delete';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';

const FolderRow = ({ folder, on_share: share, on_change_folder: change_folder,
    on_download, on_share, on_rm, on_rename, on_restore,
    enable_rm, enable_download, enable_sharing, enable_rename, enable_restore}) => {

  return (
    <TableRow key={folder.id}>
      <TableCell component="th" scope="row">
        <FontAwesomeIcon icon={faFolderOpen}></FontAwesomeIcon>{' '}
        <Link color="inherit" onClick={() => change_folder(folder)}>{folder.name}</Link>
      </TableCell>

      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">
      {enable_rename &&
        <Tooltip title="Rename">
            <IconButton onClick={() => on_rename(folder)}>
              <EditIcon fontSize='small' />
            </IconButton>
        </Tooltip>
      }
      {enable_sharing && 
        <Tooltip title="Share">
            <IconButton onClick={() => on_share(folder)}>
              <ShareIcon fontSize='small' />
            </IconButton>
        </Tooltip>
      }
      {enable_restore &&
        <Tooltip title="Restore">
            <IconButton onClick={() => on_restore(folder)}>
              <RestoreFromTrashIcon fontSize='small' />
            </IconButton>
        </Tooltip>
      }
      {enable_rm &&
        <Tooltip title="Delete">
            <IconButton onClick={() => on_rm(folder.id,folder.name)}>
              <DeleteIcon fontSize='small' />
            </IconButton>
        </Tooltip>
      }
      </TableCell>
    </TableRow>
  )
}
export default FolderRow;
