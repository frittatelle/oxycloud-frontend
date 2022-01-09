import Storage from './Storage'
import Users from './Users'
import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REGION = process.env.REACT_APP_REGION;
const COGNITO_IDP_ENDPOINT = `https://cognito-idp.${REGION}.amazonaws.com/`
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_URL;

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

class Session {
  isReady = false;
  isAuthorized = false
  idToken = null
  constructor() {
    if (this.refreshToken !== null &&
      this.isTokenExpired())
      this.refresh()
        .then(() => {
          this.isAuthorized = true;
          this.isReady = true;
        })
        .catch((err) => {
          this.refreshToken = null;
          this.idToken = null;
          this.accessToken = null;
          console.warn("refreshing initial session", err);
          this.isReady = true;
        })
    else {
      this.isAuthorized = !this.isTokenExpired();
      this.isReady = true;
    }
  }
  isTokenExpired() {
    if (this.idToken == null) return true;
    let exp = new Date(this.tokenPayload.exp * 1000);
    let now = new Date();
    return Math.abs(exp - now) <= 0;
  }
  async refresh() {
    let client = this.cognitoClient('InitiateAuth')
    let res = await client.post("",
      {
        "AuthFlow": "REFRESH_TOKEN_AUTH",
        "AuthParameters": {
          "REFRESH_TOKEN": this.refreshToken,
        },
      });
    res = res.data.AuthenticationResult;
    this.idToken = res.IdToken;
    this.accessToken = res.AccessToken;
  }
  setRefreshTimeout() {
    let exp = new Date(this.tokenPayload.exp * 1000);
    let now = new Date();

    const diffTime = Math.abs(exp - now);
    const diffSeconds = Math.ceil(diffTime / 1000);
    const delay = 1000 * (diffSeconds - 10);

    setTimeout(() => this.refresh(), delay);

  }

  async signIn({ email, password }) {
    let client = this.cognitoClient('InitiateAuth')
    try {
      let res = await client.post("",
        {
          AuthFlow: "USER_PASSWORD_AUTH",
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password
          },
        });
      res = res.data['AuthenticationResult'];
      this.idToken = res['IdToken'];
      this.accessToken = res['AccessToken'];
      this.refreshToken = res['RefreshToken'];
    } catch (err) {
      if (err.response)
        throw err.response.data.message;
      if (err.message)
        throw err.message;
      throw JSON.stringify(err);
    }
  }
  async signUp({ name, plan, email, password }) {
    let client = this.cognitoClient('SignUp')
    try {
      let res = await client.post("",
        {
          Password: password,
          Username: email,
          UserAttributes: [
            {
              Name: "name", Value: name
            },
            {
              Name: "custom:subscription_plan",
              Value: plan
            }
          ],
        });
      return res.data;
    } catch (err) {
      if (err.response)
        throw err.response.data.message;
      if (err.message)
        throw err.message;
      throw JSON.stringify(err);
    }
  }


  async signOut() {
    let client = this.cognitoClient('RevokeToken');
    try {
      await client.post("",
        {
          Token: this.refreshToken,
        });
      this.isAuthorized = false;
      this.accessToken = null;
      this.idToken = null;
      this.refreshToken = null;
    } catch (err) {
      if (err.response)
        throw err.response.data.message;
      if (err.message)
        throw err.message;
      throw JSON.stringify(err);
    }
  }

  get tokenPayload() {
    return parseJwt(this.idToken);
  }

  get refreshToken() {
    if (!this._rtkn)
      this._rtkn = localStorage.getItem("refreshToken");
    return this._rtkn
  }
  get idToken() {
    if (!this._itkn)
      this._itkn = localStorage.getItem("idToken")
    return this._itkn;
  }
  get accessToken() {
    if (!this._atkn)
      this._atkn = localStorage.getItem("accessToken")
    return this._atkn;
  }
  set refreshToken(val) {
    this._rtkn = val;
    if (val === null) localStorage.removeItem("refreshToken");
    else localStorage.setItem("refreshToken", val);
  }
  set idToken(val) {
    this._itkn = val;
    if (val === null) localStorage.removeItem("idToken");
    else localStorage.setItem("idToken", val);
  }
  set accessToken(val) {
    this._atkn = val;
    if (val === null) localStorage.removeItem("accessToken");
    else localStorage.setItem("accessToken", val);
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

  cognitoClient(method) {
    const client = axios.create({
      baseURL: COGNITO_IDP_ENDPOINT,
      headers: {
        'X-Amz-Target': `AWSCognitoIdentityProviderService.${method}`,
        'Content-Type': 'application/x-amz-json-1.1'
      }
    });
    //inject clientid in requests body
    client.interceptors.request.use((conf) => {
      let data = typeof conf.data === "string" ? JSON.parse(conf.data) : conf.data;
      data.ClientId = CLIENT_ID;
      conf.data = JSON.stringify(data);
      return conf
    });
    return client;
  }
  client(path) {
    const client = axios.create({
      baseURL: API_ENDPOINT + path,
    });

    //inject authorization header in requests
    client.interceptors.request.use((conf) => {
      conf.headers.Authorization = "Bearer " + this.idToken
      return conf
    });
    let retries = 0;
    //parse response error
    client.interceptors.response.use(
      function (res) { retries = 0; return res; },
      (err) => {
        if (err.response && err.response.data.message)
          if (err.response.headers['x-amzn-errortype'] &&
            err.response.headers['x-amzn-errortype'] === "UnauthorizedException" &&
            retries++ < 3)
            return this.refresh().then(() => client.request(err.confg));
          else
            return Promise.reject(err.response.data.message);

        if (err.message)
          return Promise.reject(err.message);
        return Promise.reject(err);
      });
    return client;
  }

}

export default new Session();
