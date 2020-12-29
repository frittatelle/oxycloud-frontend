import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import Session from "./utils/api/"

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingTop: theme.spacing(2),
  },
  logo: {
    fontWeight: 800,
    '&:hover': {
      cursor: 'pointer',
    },
    marginBot: theme.spacing(4)
  }
}));

const SplashScreen = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '90vh' }}
    >
      <Card className={classes.root} align="center">
        <CardActionArea>
          <Typography align='center' variant="h3" className={classes.logo}>
            <Typography color="primary" variant="inherit" component="span">Oxy</Typography>Cloud
          </Typography>
          <CardContent>
            <CircularProgress align='center' />
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default function App() {
  return <SplashScreen />
}
