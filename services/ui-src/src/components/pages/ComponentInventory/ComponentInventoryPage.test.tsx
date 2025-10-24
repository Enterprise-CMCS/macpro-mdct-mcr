// components
import { ComponentInventoryPage } from "components";
// utils
import { testA11yAct } from "utils/testing/commonTests";

const inventoryPage = <ComponentInventoryPage />;

describe("<inventoryPage />", () => {
  testA11yAct(inventoryPage);
});
