import Storage from './Storage'
import Users from './Users'
import AWS from "aws-sdk";
import {
    CognitoUserPool, 
    CognitoUser, 
    AuthenticationDetails
} from 'amazon-cognito-identity-js';

const USER_POOL_ID = process.env.REACT_APP_USER_POOL_ID;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const IDENTITY_POOL_ID = process.env.REACT_APP_IDENTITY_POOL_ID;
const REGION = process.env.REACT_APP_REGION;

AWS.config.region = REGION;

class Session {
  cognitoSession = null;
  constructor() {
    this.userPool = new CognitoUserPool({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID
    });
    this.cognitoUser = this.userPool.getCurrentUser();
    this.refresh();
  }

  refresh(){
      if(this.cognitoUser !== null){
        this.cognitoUser.getSession((err,session)=>{
            if(err) console.warn(err);
            this.cognitoSession = session;
        });
      }
  }

  signIn({email, password}){
    this.authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
    });
    this.cognitoUser = new CognitoUser({
        Username: email,
        Pool: this.userPool
    });

    return new Promise((resolve,reject)=>{
        this.cognitoUser.authenticateUser(this.authenticationDetails,{
            onSuccess: (res)=>{
                this.cognitoSession = res;
                let k = `cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
        	    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			        IdentityPoolId: IDENTITY_POOL_ID, 
			        Logins: { 
                        [k]: res.getIdToken().getJwtToken(),
			        },
                });
                AWS.config.credentials.refresh(error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
                },
            onFailure: reject
        });
    });
  }

  signOut() {
    let out = this.cognitoUser.signOut();
    this.cognitoSession = null;
    return out;
  }

  get isAuthorized() {
    return this.cognitoSession !== null && this.cognitoSession.isValid();
  }

  get userInfo() {
    return {
      username: this.tokenPayload['cognito:username'],
      email: this.tokenPayload['email'],
      id: AWS.config.credentials.params.IdentityId
    }
  }

  get tokenPayload() {
    return this.cognitoSession.getIdToken().decodePayload()
  }

  async refreshAwsCredentials() {
    
  }

  get storage() {
    //something better but it's fine for now
    if (!this._storage)
      this._storage = new Storage({
        session: this
      });
    return this._storage
  }

  get users() {
    if (!this._users)
      this._users = new Users({
        session: this
      });
    return this._users;
  }

}

export default new Session();
