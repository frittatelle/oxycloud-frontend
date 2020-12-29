import AWS from "aws-sdk";
//import { S3_ENDPOINT, ACCESS_KEY_ID, SECRET_ACCESS_KEY, BUCKET_NAME } from process.env;
//const S3_ENDPOINT = process.env.S3_ENDPOINT || "http://localhost:4568"
//const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "S3RVER"
//const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "S3RVER"
const S3_BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME

const S3_CONF = {
  s3ForcePathStyle: true,
 // accessKeyId: S3_ACCESS_KEY_ID,
 // secretAccessKey: S3_SECRET_ACCESS_KEY,
 // endpoint: S3_ENDPOINT,
  bucketName: S3_BUCKET_NAME
}

class Storage {
  constructor(conf) {
    this.bucket = conf.bucketName;
    this.conf = conf;
  }

  set conf(value) {
    this._conf = value;
    this.bucket = value.bucketName;
    this.s3_api = new AWS.S3(value);
  }

  get conf() {
    return this._conf;
  }

  async ls(folder = "") {
    return _processApiResponse(await
      this.s3_api.listObjects({
        Prefix: folder,
        Delimiter: "/",
        Bucket: this.bucket
      }).promise()
    );
  }

  async get(file_path, progress_cb) {
    let res = await this.s3_api.getObject({
      Key: file_path,
      Bucket: this.bucket
    }).promise()
    return { body: res.Body, content_type: res.ContentType };
  }

  async put(binary, file_path) {
    throw new Error("Not implemented");
  }

  async rm(file_path) {
    throw new Error("Not implemented");
  }

  async mkdir(path) {
    throw new Error("Not implemented");
  }

  async rmdir(path) {
    throw new Error("Not implemented");
  }
}

function _processApiResponse(data) {
  var files = data.Contents.map((f) => {
    f.Name = f.Key.split('/');
    f.Name = f.Name[f.Name.length - 1];
    return {
      path: f.Key,
      name: f.Name,
      size: f.Size,
      last_edit: new Date(f.LastModified),
      owner: f.Owner.DisplayName
    }
  });

  var folders = data.CommonPrefixes.map((f) => {
    f.Name = f.Prefix.split('/');
    // it ends with / then the split contains a empty string as last element
    f.Name = f.Name[f.Name.length - 2] + "/";
    return { name: f.Name, path: f.Prefix };
  });
  return { files, folders }
}



var _storage = new Storage(S3_CONF);


export default _storage;