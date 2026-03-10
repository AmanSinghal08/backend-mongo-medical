import { Router } from "express";
import purchaseOrderController from "./PurchaseOrderController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), purchaseOrderController.add);
_router.put("/:id", Validator("editValid"), purchaseOrderController.edit);
_router.get("/", purchaseOrderController.list);
_router.delete("/:id", purchaseOrderController.delete);

export default _router;
