import { Router } from "express";
import customerController from "./CustomerController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), customerController.add);
_router.put("/:id", Validator("editValid"), customerController.edit);
_router.get("/", customerController.list);
_router.delete("/:id", customerController.delete);

export default _router;
