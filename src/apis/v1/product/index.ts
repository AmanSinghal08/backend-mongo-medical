import { Router } from "express";
import productController from "./ProductController";
import Validator from "./validators";

const _router: Router = Router();

const _openRoutes = function () {

	/* 
		/v1/products
	*/ 
 
	 _router.post('/', Validator("addValid"), productController.add);
	 _router.put('/:id', Validator("editValid"), productController.edit);
	 _router.get('/', productController.list);
	 _router.delete('/:id', productController.delete);


};

const _routes = function () {
	_openRoutes();

	return _router;
};

export default _routes();