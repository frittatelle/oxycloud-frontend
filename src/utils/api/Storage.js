import axios from 'axios';

class Storage {
  constructor({ session }) {
    this.session = session;
  }

  async ls(folder_id = "", deleted = false) {
    let client = this.docsClient()
    let res = await client.get("", {
      params: { folder: folder_id, deleted: deleted },
    });
    res = res.data;
    for (let i = 0; i < res.files.length; i++) {
      let el = res.files[i];
      el.owner = await this.session.users.get(el.owner);
      if (el.shared_with.length > 0) {
        el.shared_with_mails = []
        for (let j = 0; j < el.shared_with.length; j++) {
          let share_user = await this.session.users.get(el.shared_with[j]);
          el.shared_with_mails.push(share_user.email);
        }
      }
    }
    return res
  }

  async get({ id, owner }, progress_cb) {
    let client = this.docsClient()
    let presigned_url = await client.get("/" + id, {
      responseType: 'text',
      params: { owner_id: owner }
    });
    presigned_url = presigned_url.data;

    let res = await axios.get(presigned_url, {
      responseType: 'arraybuffer',
      onDownloadProgress: progressEvent => {
        if (typeof progress_cb === "function") {
          progress_cb(progressEvent.loaded / progressEvent.total);
        }
      }
    });

    return { body: res.data, content_type: res.ContentType };
  }


  async put(file, folder) {
    let displayname = file.name;
    let client = this.docsClient()
    let res = await client.put("", "", {
      params: {
        filename: displayname,
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
      formData.append(key, value);
    }
    formData.append('file', file);
    formData.append('submit', 'Upload to Amazon S3');

    let resb = await axios({
      method: 'post',
      url: url,
      data: formData
    });
    return resb.data
  }

  async restore(id) {
    return this.rm(id, true);
  }
  async rm(id, restore = false, permanent = false) {
    let client = this.docsClient()
    let res = await client.delete("/" + id, {
      params: {
        delete: !restore,
        doom: permanent || false
      },
    });
    return res;
  }

  async mkdir(folder, name) {
    let client = this.docsClient()
    let res = await client.put("", "", {
      params: {
        folder: folder,
        filename: name,
        is_folder: true
      },
    });
    return res.data;
  }

  async rename(id, newName) {
    let client = this.docsClient();
    let res = await client.post("/" + id, "", {
      params: { filename: newName },
      headers: { "Content-Type": "application/json" }
    });
    return res
  }

  docsClient() {
    if (!this._docsClient)
      this._docsClient = this.session.client("/docs")
    return this._docsClient
  }
  //TODO move in another file?
  async share(id, userMail) {
    let client = this.shareClient()
    let res = await client.post("/" + id, "", {
      params: { share_email: userMail },
    });
    return res.data;
  }

  async rmShare(id, userMail) {
    let client = this.shareClient()
    let res = await client.delete("/" + id, {
      params: { unshare_email: userMail },
    });
    return res.data;
  }
  async lsShared(folder) {
    let client = this.shareClient()
    let res = await client.get("", {
    });
    res = res.data;
    for (let i = 0; i < res.files.length; i++) {
      let el = res.files[i];
      el.owner = await this.session.users.get(el.owner);
    }
    return res;
  }


  shareClient() {
    if (!this._shareClient)
      this._shareClient = this.session.client("/share")
    return this._shareClient

  }
}

export default Storage;
