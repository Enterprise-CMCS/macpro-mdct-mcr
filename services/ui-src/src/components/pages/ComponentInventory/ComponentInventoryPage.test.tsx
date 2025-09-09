// components
import { ComponentInventoryPage } from "components";
// utils
import { testA11y } from "utils/testing/commonTests";

const inventoryPage = <ComponentInventoryPage />;

describe("<inventoryPage />", () => {
  testA11y(inventoryPage);
});
