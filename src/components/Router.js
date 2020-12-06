import { useState, Component } from 'react'; 

import { 
	BrowserRouter as Router, 
	Route, 
	Link, 
	Switch 
} from 'react-router-dom'; 
import FileExplorer from './FileExplorer'
import HomeScreen from './HomeScreen'
import Login from './Login'

class App extends Component {
    render() {
      return (
        <Router>
          <div>
            <Route exact path='/' component={HomeScreen} />
            <Route exact path='/Login' component={Login} />
            <Route exact path='/FileExplorer' component={FileExplorer} />
          </div>
        </Router>
      );
    }
  }
  
  export default App;

