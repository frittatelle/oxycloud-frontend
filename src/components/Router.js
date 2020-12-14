import {  Component } from 'react'; 

import { 
	BrowserRouter as Router, 
  Route,
  Redirect 
} from 'react-router-dom'; 
import FileExplorer from './FileExplorer'
import HomeScreen from './HomeScreen'
import Login from './Login'
import About from './About'
import Contact from './Contact'

//API
import {getToken} from './Queries';


// handle the private routes
function PrivateRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />}
    />
  )
}


class App extends Component {
    render() {
      return (
        <Router>
          <div>
            <Route exact path='/' component={HomeScreen} />
            <Route path='/login' component={Login} />
            <PrivateRoute path='/fileExplorer' component={FileExplorer} />
            <Route path='/about' component={About} />
            <Route path='/contact' component={Contact} />
          </div>
        </Router>
      );
    }
  }
  
  export default App;

