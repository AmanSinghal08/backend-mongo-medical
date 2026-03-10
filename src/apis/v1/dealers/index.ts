import { Router } from "express";
import dealerController from "./DealerController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), dealerController.add);
_router.put("/:id", Validator("editValid"), dealerController.edit);
_router.get("/", dealerController.list);
_router.delete("/:id", dealerController.delete);

export default _router;
