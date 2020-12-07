import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FileRow from "./FileRow"
import FolderRow from "./FolderRow"

const FileTable = ({ folders, files }) => {
  return (
    <TableContainer>
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

export default FileTable;