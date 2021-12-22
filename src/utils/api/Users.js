import axios from 'axios';

const USERS_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_URL + "/users";
class Users {
    mem = {}
    constructor({session}){
        this.session = session;
    }
    async search(query){
        let client = this.userClient();
        let res = await client.get("",{
            params:{q:query}
        });
        return res.data;
    }

    async get(user_id){
        if(!(user_id in this.mem)){
            let client = this.userClient();
            let res = await client.get("/"+user_id);
            this.mem[user_id] = res.data;
        }
        return this.mem[user_id]
    }

    userClient(){
      return axios.create({
          baseURL: USERS_ENDPOINT, 
          headers: {
              'Authorization': this.session.cognitoSession.idToken.jwtToken,
          }
        });
    }

}

export default Users;

