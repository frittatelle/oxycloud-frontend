
//React
import React, { useState, useEffect }from 'react'; 
import axios from 'axios';

//Components
import Routers from './components/Router';

//API
import {getToken,setUserSession,removeUserSession} from './components/Queries';

function App(){
  const [authLoading, setAuthLoading] = useState(true);
  //function from component/queries : {getToken,setUserSession,removeUserSession}
  useEffect(() => {
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
      return (
       <Routers />
      );
  }
export default App;