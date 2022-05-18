import { API, Auth } from "aws-amplify";

async function requestOptions(): Promise<any> {
  try {
    const session = await Auth.currentSession();
    const token = await session.getIdToken().getJwtToken();

    const options = {
      headers: { "x-api-key": token },
    };
    return options;
  } catch (e) {
    console.log({ e }); // eslint-disable-line no-console
  }
}

async function listBanners(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.get("banners", `banners`, opts);
}

async function getBanner(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.get("banners", `banners/${inputObj.key}`, opts);
}

async function createBanner(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.post("banners", `banners`, opts);
}
async function editBanner(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.put("banners", `banners/${inputObj.key}`, opts);
}

async function deleteBanner(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.del("banners", `banners/${inputObj.key}`, opts);
}

export { listBanners, getBanner, createBanner, editBanner, deleteBanner };
