import { Router } from "express";
import inventoryController from "./InventoryController";
import Validator from "./validators";

const _router: Router = Router();

const _openRoutes = function () {

	/* 
		/v1/inventory
	*/ 
 
	 _router.post('/', Validator("addValid"), inventoryController.add);
	 _router.put('/:id', Validator("editValid"), inventoryController.edit);
	 _router.get('/', inventoryController.list);
	 _router.delete('/:id', inventoryController.delete);


};

const _routes = function () {
	_openRoutes();

	return _router;
};

export default _routes();