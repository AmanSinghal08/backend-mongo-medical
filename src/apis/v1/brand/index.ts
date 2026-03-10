import { Router } from "express";
import brandController from "./BrandController";
import Validator from "./validators";


const _router: Router = Router();

const _openRoutes = function () {

	/* 
		/v1/brand
	*/ 
 
	 _router.post('/', Validator("addValid"), brandController.add);
	 _router.put('/:id', Validator("editValid"), brandController.edit);
	 _router.get('/', brandController.list);
	 _router.delete('/:id', brandController.delete);


};

const _routes = function () {
	_openRoutes(); 

	return _router;
};

export default _routes();