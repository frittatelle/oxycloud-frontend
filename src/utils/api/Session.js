import { CognitoAuth } from 'amazon-cognito-auth-js';
import AWS from "aws-sdk";

const USER_POOL_ID = process.env.REACT_APP_USER_POOL_ID;
const USER_POOL_SUBDOMAIN = process.env.REACT_APP_USER_POOL_SUBDOMAIN;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SIGNIN_REDIRECT_URI = process.env.REACT_APP_SIGNIN_REDIRECT_URI;
const SIGNOUT_REDIRECT_URI = process.env.REACT_APP_SIGNOUT_REDIRECT_URI;
const IDENTITY_POOL_ID = process.env.REACT_APP_IDENTITY_POOL_ID;
const REGION = process.env.REACT_APP_REGION;

const cognitoWebDomain = `${USER_POOL_SUBDOMAIN}.auth.${REGION}.amazoncognito.com`;

AWS.config.region = REGION;



class Session {
  ACTION_SIGNIN = "SignIn";
  ACTION_SIGNOUT = "SignOut";
  ACTION_REFRESH_CREDENTIALS = "Refresh credentials"

  cognitoSession = null;
  cognitoAuth = null;

  onSuccess = (action) => console.log(action)
  onFailure = (action, err) => console.error(action, err)

  constructor() {
    //HORRIBLE workoaround to make it works both for unittest
    if (process.env.NODE_ENV !== "test") {
      this.cognitoAuth = new CognitoAuth({
        ClientId: CLIENT_ID,
        AppWebDomain: cognitoWebDomain,
        RedirectUriSignIn: SIGNIN_REDIRECT_URI,
        RedirectUriSignOut: SIGNOUT_REDIRECT_URI,
        UserPoolId: USER_POOL_ID,
        TokenScopesArray: []
      });
      this.cognitoAuth.userhandler = {
        onSuccess: async (result) => {
          this.cognitoSession = result;
          await this.refreshAwsCredentials();
          this.onSuccess(this.ACTION_SIGNIN)
        },
        onFailure: (err) => this.onFailure(this.ACTION_SIGNIN, err)
      }
    }
  }

  init(onSuccess, onFailure) {
    this.onSuccess = onSuccess ?? this.onSuccess
    this.onFailure = onFailure ?? this.onFailure
    this.cognitoAuth.getSession();
    if (window.location.href.indexOf("#access_token") !== -1) {
      //parse token in address bar
      this.cognitoAuth.parseCognitoWebResponse(window.location.href);
      //clean address bar
      window.location.href = window.location.href.split("#access_token")[0];
    }
  }

  async signOut() {
    this.cognitoSession = null;
    this.cognitoAuth.signOut();
    this.onSuccess(this.ACTION_SIGNOUT);
  }

  get isAuthorized() {
    return this.cognitoSession !== null;
  }

  get userInfo() {
    return {
      username: this.tokenPayload['cognito:username'],
      email: this.tokenPayload['email'],
      id: this.tokenPayload['sub']
    }
  }

  get tokenPayload() {
    return this.cognitoSession.getIdToken().decodePayload()
  }

  async refreshAwsCredentials() {
    if (!AWS.config.credentials) {

      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IDENTITY_POOL_ID,
        Logins: {
          [this.tokenPayload.iss.replace("https://", "")]: this.cognitoSession.getIdToken().getJwtToken()
        }
      });
    }

    if (AWS.config.credentials.data == null || //not requested yet
      Date.parse(AWS.config.credentials.data.Credentials.Expiration) - Date.parse(new Date()) < 0) {// is expired
      await new Promise((res, rej) => AWS.config.credentials.refresh((err => {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }))).catch(e => this.onFailure(this.ACTION_REFRESH_CREDENTIALS, e));

    }
    this.onSuccess(this.ACTION_REFRESH_CREDENTIALS);
    //this is not necessesary
    return AWS.config.credentials.data['Credentials'];
  }
}

export default new Session();