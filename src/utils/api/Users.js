
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
      if(!this._client)
        this._client = this.session.client("/users");
      return this._client;
    }

}

export default Users;

