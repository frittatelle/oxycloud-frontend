import axios from 'axios';

const DOCS_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_URL + "/docs";
const SHARE_ENDPOINT = process.env.REACT_APP_API_ENDPOINT_URL + "/share";
class Storage {
  constructor(conf) {
    this.conf = conf ?? {};
  }

  set conf(value) {
    this._conf = value;
    this.session = value ? value.session ?? {} : {} 
  }

  get conf() {
    return this._conf;
  }

  async ls(folder = "") {
    let client = this.docsClient()
    let res = await client.get("",{
        params:{ folder: folder},
    });
    res = res.data;
    for(let i=0;i<res.files.length;i++){
        let file = res.files[i];
        if(file.path.lastIndexOf("/")>0){
            file.name = file.path.substring(file.path.lastIndexOf("/") + 1, file.path.length);
        }else{
            file.name = file.path;
        }
    }
    for(let i=0;i<res.folders.length;i++){
        let folder = res.folders[i];
        if(folder.path.lastIndexOf("/")>0){
            folder.name = folder.path.substring(folder.path.lastIndexOf("/") + 1, folder.path.length);
        }else{
            folder.name = folder.path;
        }
    }
    return res
  }

  async get(file_id, progress_cb) {
    let client = this.docsClient()
    let presigned_url = await client.get("/"+file_id, {responseType: 'text'});
    presigned_url = presigned_url.data;
    
    let res = await axios.get(presigned_url, {
        responseType: 'arraybuffer',
        onDownloadProgress: progressEvent => {
          if(typeof progress_cb === "function"){
              progress_cb(progressEvent.loaded/progressEvent.total);
          }
        }
    });

    return { body: res.data, content_type: res.ContentType };
  }


  async put(file, folder) {
    let displayname = file.name;
    if(folder !== ""){
        displayname = folder + "/" + file.name;
    } 

    let client = this.docsClient()
    let res = await client.put("","",{
        params: {filename:displayname},
        headers: {
          'Content-Type': file.type,
        }
    });
    let url = res.data.url;
    let fields = res.data.fields;
    //prepare form
    let formData = new FormData();
    for (const [key, value] of Object.entries(fields)) {
        formData.append(key,value);
    }
    formData.append('file', file);
    formData.append('submit','Upload to Amazon S3');
    
    let resb = axios({
        method: 'post',
        url: url,
        data: formData
    });
    return resb.data
  }

  async rm(id) { 
    let client = this.docsClient()
    let res = await client.delete("/"+id, {
        params: {
            delete: true,
            doom: false
        },
    });
    return res;
  }

  async mkdir(path) {
    let client = this.docsClient()
    let res = await client.put("","",{
        params: {
            filename:path.replace(/^\/+|\/+$/g, ''),//aka trim("/")
            is_folder:true
        },
    });
    return res.data;
  }
    
  async share(id,userMail){
    let client = this.shareClient()
    let res = await client.post("/"+id,"",{
        params: {share_email:userMail},
    });   
    return res.data;
  }

  async rmShare(id,userMail){
    let client = this.shareClient()
    let res = await client.delete("/"+id, {
        params: {unshare_email:userMail},
    });
    return res.data;  
  }

  async rmdir(path) {
    throw new Error("Not implemented");
  }

  docsClient(){
      return axios.create({
          baseURL: DOCS_ENDPOINT, 
          headers: {
              'Authorization': this.session.idToken.jwtToken,
          }        
      });
  }
  shareClient(){
      return axios.create({
          baseURL: SHARE_ENDPOINT, 
          headers: {
              'Authorization': this.session.idToken.jwtToken,
          }
        });
  }
}

export default Storage;
