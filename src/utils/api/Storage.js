import AWS from "aws-sdk";
import Session from "./Session"


const S3_BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;


class Storage {
  constructor(conf) {
    this.conf = conf ?? {};
  }

  set conf(value) {
    this._conf = value;
    this.bucket = value ? value.bucketName ?? S3_BUCKET_NAME : S3_BUCKET_NAME;
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
      owner: f.Owner ? f.Owner.DisplayName : "you"
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

//HORRIBLE WORKAROUND
//Actually Storage should not refer Session
if (process.env.NODE_ENV !== "test")
  Session.init();

export default new Storage();