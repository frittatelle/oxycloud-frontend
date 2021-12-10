import AWS from "aws-sdk";
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_URL;
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
    return _processApiResponse(await
      this.s3Api.listObjects({
        Prefix: this.basePath + folder,
        Delimiter: "/",
        Bucket: this.bucket
      }).promise()
      , this.basePath);
  }

  async get(file_path, progress_cb) {
    let res = await this.s3Api.getObject({
      Key: this.basePath + file_path,
      Bucket: this.bucket
    }).on("httpDownloadProgress", (p) => {
      if (typeof progress_cb === "function")
        progress_cb(p.loaded / p.total)
    }).promise()
    return { body: res.Body, content_type: res.ContentType };
  }


  async put(file, folder) {
    let displayname = folder + file.name;
    let url = API_ENDPOINT+"/docs?filename="+displayname;
    let res = await axios.put(url, file,{
        headers: {
          'Authorization': this.session.idToken.jwtToken,
          'Content-Type': file.type,
        }
    }).promise();
   return res
  }

  async rm(path) {
    let res = await this.s3Api.deleteObject({

      Bucket: this.bucket,
      Key: this.basePath + path,


    })
    return { body: res.Body, content_type: res.ContentType };
  }

  async mkdir(path) {
    throw new Error("Not implemented");
  }

  async rmdir(path) {
    throw new Error("Not implemented");
  }
}



function _processApiResponse(data, basePath) {
  var files = data.Contents.filter((f) => !f.Key.endsWith("/"))
    .map((f) => {
      if (basePath !== "")
        f.Key = f.Key.split(basePath).pop();

      let name = f.Key.split('/');
      name = name[name.length - 1];
      return {
        path: f.Key,
        name: name,
        size: f.Size,
        last_edit: new Date(f.LastModified),
        owner: f.Owner ? f.Owner.DisplayName : "you"
      }
    });

  var folders = data.CommonPrefixes.map((f) => {
    if (basePath !== "")
      f.Prefix = f.Prefix.split(basePath).pop();
    let name = f.Prefix.split('/');
    // it ends with / then the split contains a empty string as last element
    name = name[name.length - 2] + "/";
    return { name: name, path: f.Prefix };
  });
  return { files, folders }
}

export default Storage;
