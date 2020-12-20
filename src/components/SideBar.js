//Styles
import { makeStyles } from '@material-ui/core/styles';

//React
import clsx from 'clsx';
import { useQuery } from 'react-query';

//Components
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';

//Icons
import FolderIcon from '@material-ui/icons/Folder';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ShareIcon from '@material-ui/icons/Share';
import StorageIcon from '@material-ui/icons/Storage';

//api
import { OxyStorage } from "../utils/api"

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: 'nowrap',
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.standard,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.easeInOut,
			duration: theme.transitions.duration.standard,
		}),
		overflowX: 'hidden',
		width: 72,
	},
}));

const fetchData = async (folder) => {
	const res = await OxyStorage.ls(folder);
	return res.folders;
}

const SideBar = ({ sidebarOpen, folder }) => {

	//Styles
	const classes = useStyles();

	//useQuery (get data)
	const {data, status, isError, error} = useQuery(
		["data"],
		() => fetchData(folder)
	);

	console.log(status, isError, error);

	return(
		<>
			{status === 'loading' && (
               console.log(status)
         )}
         {status === 'error' && (
               console.log(error)
         )}
			{status === 'success' && (
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: sidebarOpen,
						[classes.drawerClose]: !sidebarOpen,
					})}
					classes={{
						paper: clsx({
						[classes.drawerOpen]: sidebarOpen,
						[classes.drawerClose]: !sidebarOpen,
					}),}}
				>
					<Toolbar />
					<List>
						{/*TODO: map through S3 folders*/}
						{data.map((element) => (
							<ListItem button key={element.path}>
								<ListItemAvatar >
									<Avatar >
										<FolderIcon/>
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary={element.name} />
							</ListItem>
						))}
					</List>
					<Divider />
					{/* Static Lists (favorites, deleted ...) */}
					<List>
						<ListItem button>
							<ListItemAvatar>
								<Avatar>
									<AccessTimeIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Recent" />
						</ListItem>
						<ListItem button>
							<ListItemAvatar>
								<Avatar>
									<StarBorderIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Favorites" />
						</ListItem>
						<ListItem button>
							<ListItemAvatar>
								<Avatar>
									<ShareIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Shared" />
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem button>
							<ListItemAvatar>
								<Avatar>
									<DeleteOutlineIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Deleted" />
						</ListItem>
					</List>
					<Divider />
					<List>
						<ListItem button>
							<ListItemAvatar>
								<Avatar>
									<StorageIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Storage" />
						</ListItem>
					</List>
				</Drawer>
			)}
		</>
	);
}

export default SideBar;