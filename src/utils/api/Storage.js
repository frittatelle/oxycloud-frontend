import AWS from "aws-sdk";
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_URL + "/docs";
const S3_BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
class Storage {
  basePath = ""
  constructor(conf) {
    this.conf = conf ?? {};
    axios.interceptors.request.use(request => {
      console.log('Starting Request', JSON.stringify(request, null, 2))
      return request
    })

    axios.interceptors.response.use(response => {
      console.log('Response:', JSON.stringify(response, null, 2))
      return response
    })
  }
  set conf(value) {
    this._conf = value;
    this.bucket = value ? value.bucketName ?? S3_BUCKET_NAME : S3_BUCKET_NAME;
    this.basePath = value ? value.basePath ?? this.basePath : this.basePath;
    this.s3Api = new AWS.S3(value);
    this.session = value ? value.session ?? {} : {} 
  }

  get conf() {
    return this._conf;
  }

  async ls(folder = "") {
    let res = await axios.get(API_ENDPOINT,{
        params:{ folder: folder},
        headers: {
          'Authorization': this.session.idToken.jwtToken,
        }
    });
    res = res.data;
    for(var i=0;i<res.files.length;i++){
        let file = res.files[i];
        if(file.path.lastIndexOf("/")>0){
            file.folder = file.path.substring(0, file.path.lastIndexOf("/") + 1);
            file.name = file.path.substring(file.path.lastIndexOf("/") + 1, file.path.length);
        }else{
            file.name = file.path;
        }
    }
    //TODO: include folders in backend response
    res.folders = [];
    return res
  }

  async get(file_id, progress_cb) {
    let res = await axios.get(API_ENDPOINT+"/"+file_id, {
        responseType: 'arraybuffer',
        headers: {
          'Authorization': this.session.idToken.jwtToken,
        },
        onDownloadProgress: progressEvent => {
          if(typeof progress_cb === "function"){
              progress_cb(progressEvent.loaded/progressEvent.total);
          }
        }
    });
    return { body: res.data, content_type: res.ContentType };
  }


  async put(file, folder) {
    let displayname = folder + file.name;
    let res = await axios.put(API_ENDPOINT, file,{
        params: {filename:displayname},
        headers: {
          'Authorization': this.session.idToken.jwtToken,
          'Content-Type': file.type,
        }
    });
    return res
  }

  async rm(id) { 
    let res = await axios.delete(API_ENDPOINT+"/"+id, {
        params: {deleted: true},
        headers: {
          'Authorization': this.session.idToken.jwtToken,
          'Content-Type': 'application/json',
        }
    });
    return res;
  }

  async mkdir(path) {
    throw new Error("Not implemented");
  }

  async rmdir(path) {
    throw new Error("Not implemented");
  }
}

export default Storage;
