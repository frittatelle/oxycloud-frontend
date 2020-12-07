import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link'

import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';

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
export default FolderRow;