import { Router } from "express";
import dealerPaymentController from "./DealerPaymentController";
import Validator from "./validators";

const _router: Router = Router();

_router.post("/", Validator("addValid"), dealerPaymentController.add);
_router.get("/", dealerPaymentController.list);

export default _router;
