import React  from 'react';
//firing api
import axios from 'axios';
//material ui
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  local_root: {
    display: 'flex',
  },
  Wrapper: {
    textAlign: "center",
    margin:"50px"
  },
  center: {
    position: "relative",
    top: "50%",
    '&:hover':{
       color: 'white',
       background:'#257cff'
    }
  },
  paper: {
    padding: theme.spacing(2),
    margin: theme.spacing(3),      
    display: "flex",  
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
}));

const fireApi = function (e) {

  axios({
    method : 'post',
    url: 'http://localhost:5000/api/S3Bucket/CreateBucket/'+e, headers : {'Access-Control-Allow-Origin': '*'}})
    .then(res => {
      console.log(res);
    })
    .catch(error => console.log(error));
};

function BuySubsc() {
  const items = [
    { id: 1, title: '1 month subscription', content: '2 Gb for $10' },
    { id: 2, title: '3 month subscription', content: '8 Gb for $40' },
    { id: 3, title: '12 month subscription', content: '30 Gb for $100' }
  ];

  const classes = useStyles();
  return (
    <div className={classes.paper}>
      {items.map((d) => (
        <Card className={classes.root} key={d.id}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {d.title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p" >
                {d.content}
              </Typography>
            </CardContent>
          </CardActionArea>
          <div className={classes.Wrapper}>
              <Button className={classes.center} variant="outlined" color="primary" onClick={() => fireApi(d.id)}>
                Proceed
            </Button>
            </div>
        </Card>
      ))}
    </div>
  );
}


export default BuySubsc;