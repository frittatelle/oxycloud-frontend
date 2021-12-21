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

  async ls(folder_id = "", deleted=false) {
    let client = this.docsClient()
    let res = await client.get("",{
        params:{ folder: folder_id, deleted: deleted},
    });
    res = res.data;
    return res
  }

  async get({id, owner}, progress_cb) {
    let client = this.docsClient()
    let presigned_url = await client.get("/"+id, {
        responseType: 'text',
        params:{owner_id:owner}
    });
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
    let client = this.docsClient()
    let res = await client.put("","",{
        params: {
            filename:displayname,
            folder: folder 
        },
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
  
  async restore(id){
    return this.rm(id,true);
  }
  async rm(id, restore=false, permanent=false) { 
    let client = this.docsClient()
    let res = await client.delete("/"+id, {
        params: {
            delete: !restore,
            doom: permanent || false 
        },
    });
    return res;
  }

  async mkdir(folder, name) {
    let client = this.docsClient()
    let res = await client.put("","",{
        params: {
            folder: folder,
            filename: name,
            is_folder:true
        },
    });
    return res.data;
  }
    
  async rename(id,newName){
    let client = this.docsClient();
    let res = await client.post("/"+id,"",{
        params:{filename:newName},
        headers:{"Content-Type":"application/json"}
    });
    return res
  }

  docsClient(){
      return axios.create({
          baseURL: DOCS_ENDPOINT, 
          headers: {
              'Authorization': this.session.idToken.jwtToken,
          }        
      });
  }
  //TODO move in another file?
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
  async lsShared(folder){
    let client = this.shareClient()
    let res = await client.get("",{
    });

    return res.data;
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
