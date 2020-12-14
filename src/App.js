
//React
import * as React from 'react';

//Components
import Routers from './components/Router';
import MasterHeader from './components/Shared/MasterHeader';
import MasterFooter from './components/Shared/MasterFooter';

import {getToken,setUserSession,removeUserSession} from './components/Queries';
import axios from 'axios';

function App (){
  const [authLoading, setAuthLoading] = React.useState(true);
  //function from component/queries : {getToken,setUserSession,removeUserSession}
  React.useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    axios.get(`http://localhost:4000/verifyToken?token=${token}`).then(response => {
      setUserSession(response.data.token, response.data.user);
      setAuthLoading(false);
    }).catch(error => {
      removeUserSession();
      setAuthLoading(false);
  
    });
  }, []);
  
  if (authLoading && getToken()) {
    return <div className="content">Checking Authentication...</div>
  }
  

// class App extends React.Component {
//   render() {
      return (
        <div >
        <MasterHeader />
          <Routers/>
        <MasterFooter />
        </div>
       )
//       }
// }
}
export default App;
