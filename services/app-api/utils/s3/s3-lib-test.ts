//import s3Lib, {createS3Client} from "./s3-lib";

//import S3 from "aws-sdk";

//const mockPromiseCall = jest.fn();

jest.mock("aws-sdk", () => ({
  __esModule: true,
  S3: {},
}));
