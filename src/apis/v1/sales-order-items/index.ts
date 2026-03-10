import { Router } from "express";
import salesOrderItemController from "./SalesOrderItemController";

const _router: Router = Router();

// _router.post("/", Validator("addValid"), salesOrderItemController.add);
// _router.put("/:id", Validator("editValid"), salesOrderItemController.edit);
_router.get("/", salesOrderItemController.list);
// _router.delete("/:id", salesOrderItemController.delete);

_router.get("/last-sold/:productId/:customerId", salesOrderItemController.lastSold);


export default _router;
