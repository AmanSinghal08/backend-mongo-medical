import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";


class AuthController extends BaseController {
  constructor() {
    super();

    this.addUser = this.addUser.bind(this);

  }

  public async addUser(
    req: express.Request,
    res: express.Response
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
 

      _.assign(_resData, {
        data: null,
        msgCode: "1001",
        msg: getMessage("1001", "en"),
      });
    } catch (err: any) {
      console.log(err);
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });

      this.logErrors(err, "Error in AuthController.addUser");
    }

    return this.sendResponse(res, _resData);
  }

}

const authController = new AuthController();

export default authController;
