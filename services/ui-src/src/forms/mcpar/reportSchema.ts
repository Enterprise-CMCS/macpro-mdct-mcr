// mcpar
import apocSchema from "./apoc/apoc.schema";
import arpSchema from "./arp/arp.schema";
import abssSchema from "./abss/abss.schema";
// test
import testSchema from "./atest/test.schema";

export const reportSchema = {
  // mcpar
  apoc: apocSchema,
  arp: arpSchema,
  abss: abssSchema,
  // test
  test: testSchema,
};
