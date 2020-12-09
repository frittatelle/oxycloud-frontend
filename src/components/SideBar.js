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
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';

//Icons
import FolderIcon from '@material-ui/icons/Folder';

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
		width: 64,
	},
}));

const fetchData = async(api) => {
	const res = await api.listObjects({
		Prefix: "",
		Delimiter: "/",
		Bucket: "test-bucket"
  	}).promise();
  	return res.Contents;
}

const SideBar = ({sidebarOpen, api}) => {

	//Styles
	const classes = useStyles();

	//useQuery (get data)
	const {data, status, isError, error} = useQuery(
		["data"],
		() => fetchData(api)
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
					{/* Inserting the empty Toolbar for Header space*/}
					<Toolbar />
					<List>
						{/*TODO: map through S3 folders*/}
						{data.map((element) => (
							<ListItem button key={element.Key}>
								<ListItemIcon><FolderIcon /></ListItemIcon>
								<ListItemText primary={element.Key} />
							</ListItem>
						))}
					</List>
					<Divider />
					<List>
					{/*TODO: map through S3 folders*/}
					{['All mail', 'Trash', 'Spam'].map((text) => (
						<ListItem button key={text}>
							<ListItemAvatar>
								<Avatar>
									<FolderIcon />
								</Avatar>
							</ListItemAvatar>
						</ListItem>
					))}
					</List>
				</Drawer>
			)}
		</>
	);
}

export default SideBar;