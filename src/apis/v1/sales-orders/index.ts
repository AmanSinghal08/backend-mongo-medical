import { Router } from "express";
import salesOrderController from "./SalesOrderController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), salesOrderController.add);
_router.put("/:id", Validator("editValid"), salesOrderController.edit);
_router.get("/", salesOrderController.list);
_router.delete("/:id", salesOrderController.delete);

export default _router;
