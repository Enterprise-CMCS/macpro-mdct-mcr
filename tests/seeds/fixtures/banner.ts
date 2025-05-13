import crypto from "crypto";
import { faker } from "@faker-js/faker";
import { SeedBannerShape } from "../types";

function getTime(count: number = 0) {
  const today = new Date();
  const newDate = new Date(today);
  newDate.setDate(today.getDate() + count);
  return newDate.getTime();
}

const activeStart = 0;
const inactiveStart = -2;
const scheduledStart = 2;

function getStartDate(status: string) {
  if (status === "inactive") return getTime(inactiveStart);
  if (status === "scheduled") return getTime(scheduledStart);
  return getTime(activeStart);
}

function getEndDate(status: string) {
  if (status === "inactive") return getTime(inactiveStart + 1);
  if (status === "scheduled") return getTime(scheduledStart + 1);
  return getTime(activeStart + 1);
}

export const newBanner = (status: string): SeedBannerShape => ({
  key: crypto.randomUUID(),
  createdAt: getStartDate(status),
  lastAltered: getStartDate(status),
  title: faker.commerce.productName(),
  description: faker.lorem.sentence(),
  startDate: getStartDate(status),
  endDate: getEndDate(status),
});
