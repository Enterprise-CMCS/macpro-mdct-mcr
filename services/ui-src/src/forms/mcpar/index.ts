// structure
import mcparRouteStructure from "./reportStructure";
// utils
import {
  addDataToReportStructure,
  makeRouteArray,
} from "utils/reports/reports";
// section a forms
import apoc from "./apoc/apoc.json";
import arp from "./arp/arp.json";
import aap from "./aap/aap.json";
import absse from "./absse/absse.json";
// section b forms
import bpc from "./bpc/bpc.json";
import bedr from "./bedr/bedr.json";
import bpi from "./bpi/bpi.json";
// section c forms
import cpc from "./cpc/cpc.json";
import cedr from "./cedr/cedr.json";
import casfhag from "./casfhag/casfhag.json";
import cna from "./cna/cna.json";
import cam from "./cam/cam.json";
import cbss from "./cbss/cbss.json";
import cpi from "./cpi/cpi.json";
// section d forms
import dpc from "./dpc/dpc.json";
import dfp from "./dfp/dfp.json";
import dedr from "./dedr/dedr.json";
import dao from "./dao/dao.json";
import dabs from "./dabs/dabs.json";
import dsfh from "./dsfh/dsfh.json";
import dgo from "./dgo/dgo.json";
import dgbr from "./dgbr/dgbr.json";
import dqm from "./dqm/dqm.json";
import ds from "./ds/ds.json";
import dpi from "./dpi/dpi.json";
// section e forms
import ebssei from "./ebssei/ebssei.json";
// test forms
import test from "./ztest/test.json";

const combinedMcparForms = [
  apoc,
  arp,
  aap,
  absse,
  bpc,
  bedr,
  bpi,
  cpc,
  cedr,
  casfhag,
  cna,
  cam,
  cbss,
  cpi,
  dpc,
  dfp,
  dedr,
  dao,
  dabs,
  dsfh,
  dgo,
  dgbr,
  dqm,
  ds,
  dpi,
  ebssei,
  test,
];

export const mcparStructureWithData = addDataToReportStructure(
  mcparRouteStructure,
  combinedMcparForms
);

export const mcparRoutes = makeRouteArray(mcparStructureWithData);

export const nonSidebarMcparRoutes = [
  "/mcpar/intro",
  "/mcpar/dashboard",
  "/mcpar/getting-started",
];
