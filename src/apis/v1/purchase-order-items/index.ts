import { Router } from "express";
import purchaseOrderItemController from "./PurchaseOrderItemController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), purchaseOrderItemController.add);
_router.put("/:id", Validator("editValid"), purchaseOrderItemController.edit);
_router.get("/", purchaseOrderItemController.list);
_router.delete("/:id", purchaseOrderItemController.delete);

export default _router;
