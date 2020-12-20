const OAUTH_ENDPOINT = process.env.OAUTH_ENDPOINT;
const APP_ID = process.env.COGNITO_APP_ID;
const APP_SECRET = process.env.COGNITO_APP_SECRET;
const BASE_URL = process.env.BASE_URL;

const REFRESH_TOKEN_KEY = "cognito_refresh_token";

const serialize = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

const makeRequest = async (endpoint, method, body, auth) => {
  let headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
  if (auth) headers['Authorization'] = auth;
  let params = {
    method: method,
    headers: headers
  };

  if (method !== "GET" && method !== "HEAD") {
    let _body = { client_id: APP_ID };
    for (var k in body)
      _body[k] = body[k];

    params['body'] = serialize(body)
  }
  let res = await fetch(OAUTH_ENDPOINT + endpoint, params);
  res = await res.json();
  if (res.hasOwnProperty("error")) {
    throw new Error(res['error']);
  }
  return res;
}

class Session {
  login_url = OAUTH_ENDPOINT + "login?" +
    serialize({
      client_id: APP_ID,
      response_type: "code",
      redirect_uri: BASE_URL
    });

  async getTokens(code) {
    let res = null;
    if (code) {//get tokens first time
      res = await makeRequest("oauth2/token", "POST", {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: BASE_URL
      }, 'Basic ' + btoa(APP_ID + ":" + APP_SECRET));

      this.refresh_token = res['refresh_token'];
    } else {//refresh
      res = await makeRequest("oauth2/token", "POST", {
        grant_type: "refresh_token",
        refresh_token: this.refresh_token
      }, 'Basic ' + btoa(APP_ID + ":" + APP_SECRET));
    }

    this.id_token = res['id_token'];
    this.access_token = res['access_token'];
    let d = new Date()
    d.setSeconds(d.getSeconds() + res['expires_in']);
    this.expires_date = d;
    if (!this.user_info)
      this.user_info = await this._getUserInfo();
  }
  get is_authorized() {
    return localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
  }
  get refresh_token() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  set refresh_token(val) {
    localStorage.setItem(REFRESH_TOKEN_KEY, val)
  }

  async _getUserInfo() {
    let res = await makeRequest("oauth2/userInfo", "GET", {}, 'Bearer ' + this.access_token)
    return res;
  }

  async logOut() {
    let url = OAUTH_ENDPOINT + "logout?" +
      serialize({
        client_id: APP_ID,
        logout_uri: BASE_URL
      });

    localStorage.removeItem(REFRESH_TOKEN_KEY);
    delete this.access_token
    delete this.expires_date
    delete this.id_token
    delete this.user_info
    window.location = url;
  }

}

export default new Session();