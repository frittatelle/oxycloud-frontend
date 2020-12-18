import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FileRow from "./FileRow"
import FolderRow from "./FolderRow"

const FileTable = ({ folders, files, on_share, on_download, on_change_folder }) => {
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
          {folders.map((f) =>
            <FolderRow
              name={f.name}
              path={f.path}
              on_share={on_share}
              on_change_folder={on_change_folder}
            />)}
          {files.map((f) =>
            <FileRow
              file={f}
              on_share={on_share}
              on_download={on_download}
            />)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default FileTable;