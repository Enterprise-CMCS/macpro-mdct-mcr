// This file is managed by macpro-mdct-core so if you'd like to change it let's do it there
if (!process.env.PROJECT) {
  throw new Error("PROJECT environment variable is required but not set");
}
export const project = process.env.PROJECT;
export const region = "us-east-1";
