import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import FileRow from "./FileRow"
import FolderRow from "./FolderRow"

import { OxyStorage } from "../../utils/api"

import { useQuery } from 'react-query';

const FileTable = ({ folder, on_share, on_download, on_change_folder }) => {
  const FSTree = useQuery(["fsTree", folder], () => OxyStorage.ls(folder))
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
          {FSTree.data.folders.map((f) =>
            <FolderRow
              name={f.name}
              path={f.path}
              on_share={on_share}
              on_change_folder={on_change_folder}
            />)}
          {FSTree.data.files.map((f) =>
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