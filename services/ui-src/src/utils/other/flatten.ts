import { AnyObject } from "types";

export const flatten = (obj: AnyObject, out: AnyObject) => {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == "object") {
      out = flatten(obj[key], out);
    } else {
      out[key] = obj[key];
    }
  });
  return out;
};
