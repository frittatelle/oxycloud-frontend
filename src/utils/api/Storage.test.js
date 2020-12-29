import Storage from "./Storage";
import fs from 'fs';

//to run and initialize a s3 bucket
const S3rver = require('s3rver');
//const AWS = require('aws-sdk')

const _LOCAL_DIR = '/tmp/s3rver_test_directory';
let instance;
beforeAll(() => {
  const corsConfig = require.resolve('s3rver/example/cors.xml');
  const websiteConfig = require.resolve('s3rver/example/website.xml');
  instance = new S3rver({
    port: 6660,
    hostname: 'localhost',
    silent: true,
    directory: _LOCAL_DIR,
    configureBuckets: [
      {
        name: 'test-bucket',
        configs: [fs.readFileSync(corsConfig), fs.readFileSync(websiteConfig)],
      },
    ],
  }).run(() => { });

  Storage.conf = {
    s3ForcePathStyle: true,
    accessKeyId: "S3RVER",
    secretAccessKey: "S3RVER",
    endpoint: "http://localhost:6660",
    bucketName: "test-bucket",
    Bucket: "test-bucket"
  };
});

afterAll(() => {
  instance.close(() => { })
  fs.rmdirSync(_LOCAL_DIR, { recursive: true })
});

beforeEach(() => {

});

afterEach(() => {

});


describe("list files", () => {
  it("ls method exist", () => {
    expect(Storage.ls).not.toBe(undefined);
  });
  it("call ls method", async () => {
    let res = await Storage.ls();
    expect(res).not.toBe(undefined);
    expect(res).toHaveProperty("files");
    expect(res).toHaveProperty("folders");
  })
});

describe("get files", () => {
  it("get method exist", () => {
    expect(Storage.get).not.toBe(undefined);
  });

});


describe("put files", () => {
  it("put method exist", () => {
    expect(Storage.put).not.toBe(undefined);
  });

});


describe("delete files", () => {
  it("rm method exist", () => {
    expect(Storage.rm).not.toBe(undefined);
  });

});

describe("create directory", () => {
  it("mkdir method exist", () => {
    expect(Storage.mkdir).not.toBe(undefined);
  });

});


describe("delete directory", () => {
  it("rmdir method exist", () => {
    expect(Storage.rmdir).not.toBe(undefined);
  });

});