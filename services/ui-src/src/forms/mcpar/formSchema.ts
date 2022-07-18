// mcpar
import apocSchema from "./apoc/apoc.schema";
import arpSchema from "./arp/arp.schema";
// test
import testSchema from "./atest/test.schema";

export const formSchema = {
  // mcpar
  apointofcontact: apocSchema,
  areportingperiod: arpSchema,
  // test
  test: testSchema,
};
