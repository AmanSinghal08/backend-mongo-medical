import { Router } from "express";
import customerCollectionController from "./CustomerCollectionController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), customerCollectionController.add);
_router.put("/:id", Validator("editValid"), customerCollectionController.edit);
_router.get("/", customerCollectionController.list);
_router.delete("/:id", customerCollectionController.delete);

export default _router;
