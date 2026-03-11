import * as express from "express";
import * as UtilsHelper from "../../../helpers/utils.helper";
import { IResponseObject } from "../../../helpers/utils.interface";
import BaseController from "../../../helpers/BaseController";
import _ from "lodash";
import getMessage from "../../../i18";
import Admin from "../../../models/Admin";


class AuthController extends BaseController {
  constructor() {
    super();

    this.addUser = this.addUser.bind(this);
    this.login = this.login.bind(this);
    this.sessionStatus = this.sessionStatus.bind(this);
  }

  public async addUser(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {

      await Admin.create(req.body)
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
  public async login(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const { mobileNo, password } = req.body;

      const admin = await Admin.findOne({ mobileNo });
      if (!admin) {
        _.assign(_resData, {
          statusCode: 401,
          status: "error",
          msg: "Invalid mobile number or password.",
        });
        return this.sendResponse(res, _resData);
      }

      if (admin.isActive === false) {
        _.assign(_resData, {
          statusCode: 403,
          status: "error",
          msg: "Account is inactive.",
        });
        return this.sendResponse(res, _resData);
      }

      const ok = await admin.comparePassword(password);
      if (!ok) {
        _.assign(_resData, {
          statusCode: 401,
          status: "error",
          msg: "Invalid mobile number or password.",
        });
        return this.sendResponse(res, _resData);
      }

      (req as any).session = (req as any).session || {};
      (req as any).session.adminId = admin._id?.toString?.() || admin._id || admin.mobileNo;
      (req as any).session.role = admin.role;

      _.assign(_resData, {
        data: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          mobileNo: admin.mobileNo,
          email: admin.email,
          role: admin.role,
        },
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

      this.logErrors(err, "Error in AuthController.login");
    }

    return this.sendResponse(res, _resData);
  }

  public async sessionStatus(
    req: express.Request,
    res: express.Response,
  ): Promise<void | any> {
    const _resData: IResponseObject = UtilsHelper.responseObject();
    try {
      const authenticated = Boolean((req as any).session?.adminId);
      _.assign(_resData, {
        data: authenticated,
        msgCode: "1005",
        msg: getMessage("1005", "en"),
      });
    } catch (err: any) {
      _.assign(_resData, {
        statusCode: 500,
        status: "error",
        msg: err.message,
      });
      this.logErrors(err, "Error in AuthController.sessionStatus");
    }

    return this.sendResponse(res, _resData);
  }
}

const authController = new AuthController();

export default authController;
