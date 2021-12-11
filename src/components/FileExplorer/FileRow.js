import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import data from '../data.json';


import * as FaIcons from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import GetAppIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import IconButton from '@material-ui/core/IconButton';

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
  if(typeof date.getMonth !== 'function'){
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
  { id, path, name, size, owner, last_edit },
  on_download, on_share, on_rm }) => {
  return (
    <TableRow key={id} >
      <TableCell>
        {getIcon(name.split('.').pop())}
      </TableCell>
      <TableCell title="file name" component="th">
        {name}
      </TableCell>
      <TableCell title="file size" align="right">
        {getReadableFileSizeString(size)}
      </TableCell>
      <TableCell title="file owner" align="right">
        {owner}
      </TableCell>
      <TableCell title="last modified datetime" align="right">
        {formatDate(last_edit)}
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={() => on_download({ id, name })}>
          <GetAppIcon fontSize='small' />
        </IconButton>
        <IconButton onClick={() => on_share({ path, name })}>
          <ShareIcon fontSize='small' />
        </IconButton>
        <IconButton onClick={() => on_rm(id)}>
          <GetAppIcon fontSize='small' />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default FileRow;
