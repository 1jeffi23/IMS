import { productApi } from "./productApi";
import { productBatchApi } from "./productBatchApi";

export const invalidateInventoryCache = (dispatch) => {
  dispatch(
    productApi.util.invalidateTags(["Product",])
  );

  dispatch(
    productBatchApi.util.invalidateTags([
      "ProductBatch",
    ])
  );
};