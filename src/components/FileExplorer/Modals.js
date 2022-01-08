import React from 'react';
//components
import Typography from '@material-ui/core/Typography';
import Modal from "@material-ui/core/Modal";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip'

import { OxySession } from "../../utils/api"

import { useState } from 'react'
import { toast } from 'react-toastify';


const MkDirModal = ({ open, onComplete, handleClose, currentFolder }) => {
    const [dirName, setDirName] = useState("");
    const mkdir = () => {

        toast.promise(
            OxySession.storage.mkdir(currentFolder.id, dirName)
            , {
                pending: `Creating ${dirName}`,
                success: {
                    render() {
                        onComplete()
                        return `${dirName} created`
                    }
                },
                error: {
                    render({ data }) {
                        if (typeof data.message === "string")
                            return data.message
                        return JSON.stringify(data)
                    }
                }
            });
        handleClose();
        setDirName("");
    }
    return (
        <Modal
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            open={open}
            onClose={handleClose}>
            <Card align="left" style={{ minWidth: 275 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        New folder..
                    </Typography>
                    <form noValidate autoComplete="off"
                        onSubmit={(e) => { e.preventDefault(); setDirName(e.target[0].value) }} >
                        <TextField value={dirName} label="name" variant="outlined"
                            onChange={(e) => { setDirName(e.target.value) }} />
                    </form>
                    <CardActions>
                        <Button
                            disabled={dirName === ""}
                            size="small"
                            onClick={mkdir}>
                            Confirm
                        </Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Modal>
    )
}

const ShareModal = ({ open, handleClose, shareParams, setShareParams }) => {
    const [userMail, setUserMail] = useState("");

    const share = () => {
        toast.promise(
            OxySession.storage.share(shareParams.id, userMail)
            , {
                pending: `Sharing ${shareParams.name} with ${userMail}`,
                success: `${shareParams.name} shared with ${userMail}`,
                error: {
                    render({ data }) {
                        if (typeof data.message === "string")
                            return JSON.stringify(data.message)
                        return JSON.stringify(data)
                    }
                }
            });
        handleClose();
        setUserMail("");
    }
    // eslint-disable-next-line
    const delShare = (shareUserMail) => {
        toast.promise(
            OxySession.storage.rmShare(shareParams.id, shareUserMail)
            , {
                pending: `Removing ${shareUserMail} from ${shareParams.name} share list`,
                success: `${shareUserMail} removed from ${shareParams.name} share list `,
                error: {
                    render({ data }) {
                        if (typeof data.message === "string")
                            return JSON.stringify(data.message)
                        return JSON.stringify(data)
                    }
                }
            });
        setShareParams({ ...shareParams, shared_with_mails: [] });
    }
    return (
        <Modal
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            open={open}
            onClose={handleClose}>
            <Card align="left" style={{ minWidth: 275 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Share '{shareParams.name}' with...
                    </Typography>
                    <form noValidate autoComplete="off"
                        onSubmit={e => { e.preventDefault(); setUserMail(e.target[0].value) }}>
                        <TextField value={userMail} label="email" variant="outlined"
                            onChange={(e) => { setUserMail(e.target.value) }} />
                    </form>
                    {shareParams.shared_with_mails ? shareParams.shared_with_mails.map(
                        (shareUserMail) => <Chip label={shareUserMail} onDelete={() => delShare(shareUserMail)} />
                    ) : null}
                    <CardActions>
                        <Button
                            disabled={userMail === ""}
                            size="small"
                            onClick={share}>Confirm</Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Modal>
    )
}

const RenameModal = ({ open, handleClose, renameParams, onComplete }) => {
    const [newName, setNewName] = useState("");
    const rename = () => {
        const ext = renameParams.name.split('.')[1]
        let extendedNewName = ''
        if (newName.includes('.')) {
            const extNewName = newName.split('.')[1]
            if (extNewName === ext) {
                extendedNewName = newName
            } else {
                extendedNewName = newName.split('.')[0] + '.' + ext
            }
        } else {
            extendedNewName = newName + '.' + ext
        }
        toast.promise(
            OxySession.storage.rename(renameParams.id, extendedNewName)
            , {
                pending: `Renaming ${renameParams.name} to ${extendedNewName}`,
                success: {
                    render() {
                        onComplete();
                        return `${renameParams.name} renamed to ${extendedNewName}`
                    }
                },
                error: {
                    render({ data }) {
                        if (typeof data.message === "string")
                            return data.message
                        return JSON.stringify(data)
                    }
                }
            });
        setNewName("");
        handleClose();
    }
    return (
        <Modal
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            open={open}
            onClose={handleClose}>
            <Card align="left" style={{ minWidth: 275 }}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Rename '{renameParams.name}' as...
                    </Typography>
                    <form noValidate autoComplete="off"
                        onSubmit={e => { e.preventDefault(); setNewName(e.target[0].value) }}>
                        <TextField value={newName} label="new name" variant="outlined"
                            onChange={(e) => { setNewName(e.target.value) }} />
                    </form>
                    <CardActions>
                        <Button
                            disabled={newName === ""}
                            size="small"
                            onClick={rename}>Confirm</Button>
                    </CardActions>
                </CardContent>
            </Card>
        </Modal>
    )
}
const Modals = {
    Rename: RenameModal,
    MkDir: MkDirModal,
    Share: ShareModal
};
export default Modals;
