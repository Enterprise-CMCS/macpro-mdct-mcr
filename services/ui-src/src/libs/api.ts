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
    console.log({ e });
  }
}

async function listMeasures(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.get(
    "coreSet",
    `/coreset/${inputObj.state}/${inputObj.year}/${inputObj.coreSet}/measures/list`,
    opts
  );
}

async function getMeasure(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.get(
    "coreSet",
    `/coreset/${inputObj.state}/${inputObj.year}/${inputObj.coreSet}/measures/${inputObj.measure}/get`,
    opts
  );
}

async function createMeasure(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;

  return API.post(
    "coreSet",
    `/coreset/${inputObj.state}/${inputObj.year}/${inputObj.coreSet}/measures/${inputObj.measure}/create`,
    opts
  );
}
async function editMeasure(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;

  return API.put(
    "coreSet",
    `/coreset/${inputObj.state}/${inputObj.year}/${inputObj.coreSet}/measures/${inputObj.measure}/edit`,
    opts
  );
}

async function deleteMeasure(inputObj: any) {
  const opts = await requestOptions();
  opts.body = inputObj.body;
  return API.del(
    "coreSet",
    `/coreset/${inputObj.state}/${inputObj.year}/${inputObj.coreSet}/measures/${inputObj.measure}/delete`,
    opts
  );
}

export {
  listMeasures,
  getMeasure,
  createMeasure,
  editMeasure,
  deleteMeasure,
};
