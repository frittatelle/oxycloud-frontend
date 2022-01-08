import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import data from '../data.json';



import * as FaIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PublishIcon from '@material-ui/icons/Publish';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';

const getIcon = (ext) => {
  for (const [, type] of data.entries())
    if (type.ext === ext)
      return <FontAwesomeIcon icon={FaIcons[type.icon]} />
  return <FontAwesomeIcon icon={FaIcons['faFile']} />
}


function getReadableFileSizeString(fileSizeInBytes) {
  var i = -1;
  var byteUnits = [' kB', ' MB', ' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
  do {
    fileSizeInBytes = fileSizeInBytes / 1024;
    i++;
  } while (fileSizeInBytes >= 1024);
  var val = Math.max(fileSizeInBytes, 0.1).toFixed(1)
  if (val.toString().endsWith(".0")) {
    val = val.replace(".0", "")
  }
  return val + byteUnits[i];
};

function formatDate(date) {
  //https://stackoverflow.com/a/25275914
  if (typeof date.getMonth !== 'function') {
    date = new Date(Date.parse(date))
  }
  var year = date.getFullYear(),
    month = date.getMonth() + 1, // months are zero indexed
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
    minuteFormatted = minute < 10 ? "0" + minute : minute,
    morning = hour < 12 ? "am" : "pm";

  return day + "/" + month + "/" + year + " " + hourFormatted + ":" +
    minuteFormatted + morning;
}
const FileRow = ({ file:
  { id, path, name, size, owner, last_edit, shared_with, shared_with_mails },
  on_download, on_share, on_rm, on_rename, on_restore,
  enable_rm, enable_download, enable_sharing, enable_rename, enable_restore }) => {
  return (
    <TableRow key={id} >
      <TableCell title="file name" component="th">
        {getIcon(name.split('.').pop())}
        {' '}
        {name}
      </TableCell>
      <TableCell title="file size" align="right">
        {getReadableFileSizeString(size)}
      </TableCell>
      <TableCell title="file owner" align="right">
        {owner.email}
      </TableCell>
      <TableCell title="last modified datetime" align="right">
        {formatDate(last_edit)}
      </TableCell>
      <TableCell align="right" width="20%">
        {enable_download &&
          <Tooltip title="Download">
            <IconButton onClick={() => on_download({ id, owner: owner.id, name })}>
              <GetAppIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
        {enable_rename &&
          <Tooltip title="Rename">
            <IconButton onClick={() => on_rename({ id, name })}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
        {enable_sharing &&
          <Tooltip title="Share">
            <IconButton onClick={() => on_share({ id, name, shared_with, shared_with_mails })}>
              <ShareIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
        {enable_rm && enable_download &&
          <Tooltip title="Re-Upload">
            <IconButton onClick={() => console.log("reupload")}>{/*on_reupload(id)}>*/}
              <PublishIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
        {enable_restore &&
          <Tooltip title="Restore">
            <IconButton onClick={() => on_restore({ id, name })}>
              <RestoreFromTrashIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
        {enable_rm &&
          <Tooltip title="Delete">
            <IconButton onClick={() => on_rm(id, name)}>
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        }
      </TableCell>
    </TableRow>
  )
}

export default FileRow;
