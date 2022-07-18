// internal
import abfSchema from "./internal/abf.schema";
// mcpar
import apocSchema from "./mcpar/apoc.schema";
import arpSchema from "./mcpar/arp.schema";
import abssSchema from "./mcpar/abss.schema";
// test
import testSchema from "./mcpar/test.schema";

export const formSchema = {
  // internal
  adminBannerForm: abfSchema,
  // mcpar
  apointofcontact: apocSchema,
  areportingperiod: arpSchema,
  abssentities: abssSchema,
  // test
  test: testSchema,
};
