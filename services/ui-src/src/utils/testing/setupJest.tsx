import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import "jest-axe/extend-expect";

global.React = React;

/*
 * Mocks window.matchMedia
 * https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

/*
 * From Chakra UI Accordion test file
 * https://bit.ly/3MFtwXq
 */
jest.mock("@chakra-ui/transition", () => ({
  ...jest.requireActual("@chakra-ui/transition"),
  Collapse: jest.fn(({ in: inProp, children }: any) => (
    <div hidden={!inProp}>{children}</div>
  )),
}));

// jest.mock("../api/requestMethods/getRequestHeaders", () => ({
//   getRequestHeaders: jest.fn().mockReturnValue({
//     "x-api-key": "eyJtestToken",
//   }),
// }));

// jest.mock("aws-amplify", () => ({
//   __esModule: true,
//   Auth: {
//     currentSession: {
//       // return {
//       //   idToken: {
//       //     jwtToken: "eyJLongToken",
//       //   },
//       // };
//       // return {
//       getIdToken: {
//         getJwtToken: jest.fn().mockImplementation(() => {
//           return "fakeTokenHere";
//         }),
//         // };
//       },
//     },
//   },
// }));

jest.mock("aws-amplify", () => ({
  __esModule: true,
  Auth: {
    currentSession: jest.fn().mockReturnValue({
      getIdToken: jest.fn().mockReturnValue({
        getJwtToken: jest.fn().mockReturnValue("eyJLongToken",)
      })
    }),
  },
})),

// const session = {
//   idToken: {
//     jwtToken:
//       "eyJraWQiOiJ0VkEyV3ZnTnQ2bElreFVMekZFYUdRcVdmUzErZFZtdTFIemIyUlFyZm53PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmOTdiMzA0MS1kZDcxLTQ1NGYtYTYyZi1hYjExMzQwOGM0ZTMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfbGVyRHZzNHduIiwiY29nbml0bzp1c2VybmFtZSI6ImY5N2IzMDQxLWRkNzEtNDU0Zi1hNjJmLWFiMTEzNDA4YzRlMyIsImN1c3RvbTpjbXNfcm9sZXMiOiJtZGN0bWNyLWFwcHJvdmVyIiwiZ2l2ZW5fbmFtZSI6IkFkYW0iLCJvcmlnaW5fanRpIjoiNDhhYTljOWYtM2JmMS00YWIyLTlhMzUtMTdiNTkxOWI0OTg4IiwiYXVkIjoiNG4yYW5kZDdxdW1qZ2RvamVjM2NicXNlbXUiLCJldmVudF9pZCI6IjFlNjI1YzhjLTQwZTQtNDQwMC1iMzljLTkzYTA4MDdlOGE0NCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjU0MTc5ODU5LCJleHAiOjE2NTQxODgyNzMsImlhdCI6MTY1NDE4NDY3MywiZmFtaWx5X25hbWUiOiJBZG1pbnMiLCJqdGkiOiJkMmY5ZDdjNS0wNDgwLTQxZTUtYTEwMy0yNDM0YzM0MjhiYTIiLCJlbWFpbCI6ImFkbWludXNlckB0ZXN0LmNvbSJ9.mRQZ-bZk2ahaMHzOCgWjx1DYdRrgvHYMyTLBhevVxhXDDO6yAYOPcLk7VNWkHU-ZblGL7IGuO39t0xMxJ5sP2bhxuCYJc7RhkFE6CrsbUP35-PvqbdxamvrPzxfssKn2tz6_PJN3pEkSWOY5DF17e3yThy1JMcSXx4aXCE-LdIw3vBZnxYt1VgpV_phxz74OPKCQkEMTKWF7TeyxkyRBjWlu2pKSX-oavGYuNvdA4JBGHXrsNDjNDwuYga1xDClJteOcEw1lVK3eRedr_fo1LC0loD3KYTeT5X2URNxkCuKT1G37wLc_I3fmasAFOcFkZIAFuuh87UIVZ2iyhFz9wg",
//     payload: {
//       sub: "f97b3041-dd71-454f-a62f-ab113408c4e3",
//       email_verified: true,
//       iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_lerDvs4wn",
//       "cognito:username": "f97b3041-dd71-454f-a62f-ab113408c4e3",
//       "custom:cms_roles": "mdctmcr-approver",
//       given_name: "Adam",
//       origin_jti: "48aa9c9f-3bf1-4ab2-9a35-17b5919b4988",
//       aud: "4n2andd7qumjgdojec3cbqsemu",
//       event_id: "1e625c8c-40e4-4400-b39c-93a0807e8a44",
//       token_use: "id",
//       auth_time: 1654179859,
//       exp: 1654188273,
//       iat: 1654184673,
//       family_name: "Admins",
//       jti: "d2f9d7c5-0480-41e5-a103-2434c3428ba2",
//       email: "adminuser@test.com",
//     },
//   },
//   refreshToken: {
//     token:
//       "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.KDk7De9UfA9Ufzp7XaXoxRozgd17xeYAzhiv4aukTr8arJmS1bSdBMhEV4mEl6XoVsso9605xdjgzVY_TIGdr-E1kxMbfxrg1PIPX54oVE8T88aV7eXaJTiRZWgU65rinnmwn0F2CYKsNbwF1GiMSxtpZDSFMg53klKOj0RPTc8WChfgXfhXTRz9m5heSA_6rAXkbGKaRNDtpLEJEXiH9auuMaXJHrYkzkPOzJT3ZO6HC7uUK2cqfGipwfPwWe7APCdMx7uhij_FLMzG13QlHRixzchleRKcZk2ZIuj8xCg-5Q60UxM6F3GBYcgTdK8e3UaLCTELC4uO-SshCt-MTQ.uQt9R5a-GcckJRk2.YIZsBmvyKM5dedd7tzZ02RKI0nbWMJPe7oEumQZbvl72PuSsDqELiTVkOsgqRzHH7HoCvqYVE2JmjuiR7TCRy1w-lN8btIuZh1T_tdEPm_-pUPH2p17HXHqnmTZv5yVmE46SRv_2nf30vQcxTQ7AegF19i1NR70E6oYBe9BeVJAVqeieH7Ab1cu4Vcgw-ir2XlzKQYbwRpgiG6SMsqgtQrrCR84isTAWQUb3z3yNlH0FFv0D1RxkUTzFCzsYYJtoSfH09FxGjq2BaTQwrArbOWZAtlTKotQLTXKeMF0q54EkppRvnIWiXDrezLd0sLc7UT2sXV6KQHNHC21yvodOkipgh6Pfwm4Zn7UOSjD15wgXqSMnrGBz4Ak1isU9cCk8SWgx8QWAwfutnuk7--dcTDTu-nNh073RQwpppjbADt8ChzUdu_XRWFgthtzLUGOu2bteQTjKY1koK0q6M0ftphUAYU543Jk9-aLublgKYq8P6cSsKNusk4HT-eyVudhUYqInotFjYbaTy8ppS2HpuTmdk-GqOrw0lb7RZVwV11UNX_n0qwQWt3H1NQFBv9RoINU2GmK_BKGscn_F1edgy7gJ-js2NVltNx_00A4c4mpdZzj_RhD_c-T8Wijwbfz1HZG7Sq-3apB657IgoHfbE5exfljVsB1VdQIQMgBvDCneWlia6ShKKanSjsPCIUZ0aWP1EfW8RkBSDO9xT28Q2e5jp4PEOlN_wjM2q-mRF0boq8UE66IGeyLNzyDYMzeOHoGqKutCcKdRIhGeTZ9z9uwZ5RrCyK7JftMlj4ZvYe-jpcHoKC_zjUbZXp9vhFloUBNky3l1xP5u8ODVgzx7qFWxKOroFbF1nbQcblOxmaFJ6xlHb682lbASjCap0itdiiprQTY3-OueO3Xn3cFYhimK8OnlxvUqSi1SdaVvHpZK5ZXy2Rhr1Tuj_D7BIRKXGUNKiwrJrwoNq7b7XvY2k8Gy5pof3FtVYxoS8Off7IYcA-lhXqSPSkw9VBSRGJGsVcHqKdgCeveX_tgFBRjfB-Dff85kWcixcthccsX3hKEWfN2m42ksmWr11i6LqwRLzZZFhmlAb7iYULCkDqU7HL5HSujCc9W8qE0e3-Yj7FeXhpgsxgAnijGI0WQZx_ub0XeCSaTCInLXzpJ1vIqcVfV-BIJUuW_8_kmRrE7ICdXIzDMX8BiyF-Zz90BqDYUSAFGj_lsMVKn-TqneSM5opZDsWm3dirto2XIWIac0VW90UAQ3RnMaMVepYcli3VjwL6biyaqc19SZA2Pl68YWL6ULJr4_WyUcYB2dxFiVdMg5QCHa9hhnXTtP3jzOXqs.09equrQjT6BraifWtcGFhQ",
//   },
//   accessToken: {
//     jwtToken:
//       "eyJraWQiOiJPOGoxcndaU08zblQ5eWNCMTl6VWxWaW5ReUVnVVN3T3ZIV29lZlpYQkJ3PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmOTdiMzA0MS1kZDcxLTQ1NGYtYTYyZi1hYjExMzQwOGM0ZTMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9sZXJEdnM0d24iLCJjbGllbnRfaWQiOiI0bjJhbmRkN3F1bWpnZG9qZWMzY2Jxc2VtdSIsIm9yaWdpbl9qdGkiOiI0OGFhOWM5Zi0zYmYxLTRhYjItOWEzNS0xN2I1OTE5YjQ5ODgiLCJldmVudF9pZCI6IjFlNjI1YzhjLTQwZTQtNDQwMC1iMzljLTkzYTA4MDdlOGE0NCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NTQxNzk4NTksImV4cCI6MTY1NDE4ODI3MywiaWF0IjoxNjU0MTg0NjczLCJqdGkiOiJiMzZkMWUxYy04ZTlkLTQyYzQtYmQ5OS1lMDhkNTdjZmZmZDYiLCJ1c2VybmFtZSI6ImY5N2IzMDQxLWRkNzEtNDU0Zi1hNjJmLWFiMTEzNDA4YzRlMyJ9.Ok7VwqC6QllRlmEJBdkwxvWKYTgOf7m3-Bg90Wp7zt-0R7Cr-DMn5DML1Tghevx_HNqti_cN8IHK-euCrhxPlbLNLWgse3yhy2gYFocdTRpXeIOscOjIFlJD6vJCO0LsGdRQqifNWQ1-Akv-cpCG3q2xfpO6NtZFsOAl6KVKJR-B7lGuSmrrrQhh8D3cxZV2P9NAi1OnE5kSDoXcGEKG3pTtVcefYS6krq22jTsNqYfMJUukqHw9CRbV-Z_0picG65cOTPSMmLdMumcQR8g4GTcdzcvqPldBajgSy_LzfwWcaz1q4Dxi5eG2rHQpenYwMp60Td5Patw4nmOZpdhc1w",
//     payload: {
//       sub: "f97b3041-dd71-454f-a62f-ab113408c4e3",
//       iss: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_lerDvs4wn",
//       client_id: "4n2andd7qumjgdojec3cbqsemu",
//       origin_jti: "48aa9c9f-3bf1-4ab2-9a35-17b5919b4988",
//       event_id: "1e625c8c-40e4-4400-b39c-93a0807e8a44",
//       token_use: "access",
//       scope: "aws.cognito.signin.user.admin",
//       auth_time: 1654179859,
//       exp: 1654188273,
//       iat: 1654184673,
//       jti: "b36d1e1c-8e9d-42c4-bd99-e08d57cfffd6",
//       username: "f97b3041-dd71-454f-a62f-ab113408c4e3",
//     },
//   },
//   clockDrift: 0,
// };

export const mockStateUser = {
  user: {
    attributes: {
      "custom:cms_roles": "mdctmcr-state-user",
      "custom:cms_state": "MA",
      email: "stateuser1@test.com",
      family_name: "States",
      given_name: "Sammy",
    },
  },
  userRole: "mdctmcr-state-user",
  showLocalLogins: true,
  logout: () => {},
  loginWithIDM: () => {},
};

export const mockAdminUser = {
  user: {
    attributes: {
      "custom:cms_roles": "mdctmcr-approver",
      "custom:cms_state": undefined,
      email: "adminuser@test.com",
      family_name: "Admin",
      given_name: "Adam",
    },
  },
  userRole: "mdctmcr-approver",
  showLocalLogins: false,
  logout: () => {},
  loginWithIDM: () => {},
};

export const RouterWrappedComponent: React.FC = ({ children }) => (
  <Router>{children}</Router>
);
