import { Application } from "express";
import AuthRouter from "./auth";
import IndexRouter from "./general";
import inventoryRouter from "./inventory";
import productRouter from "./product";
import brandRouter from "./brand";
import customerRouter from "./customers";
import dealerRouter from "./dealers";
import purchaseOrderRouter from "./purchase-orders";
import purchaseOrderItemRouter from "./purchase-order-items";
import salesOrderRouter from "./sales-orders";
import salesOrderItemRouter from "./sales-order-items";
import customerCollectionRouter from "./customer-collections";
import dealerPaymentRouter from "./dealer-payments";
import Auth from "../../services/Auth";

export function mount(app: Application): void {
  app.use("/v1/auth", AuthRouter);
  app.use("/v1", Auth, IndexRouter);
  app.use("/v1/inventory", Auth, inventoryRouter);
  app.use("/v1/products", Auth, productRouter);
  app.use("/v1/brands", Auth, brandRouter);
  app.use("/v1/customers", Auth, customerRouter);
  app.use("/v1/dealers", Auth, dealerRouter);
  app.use("/v1/purchase-orders", Auth, purchaseOrderRouter);
  app.use("/v1/purchase-order-items", Auth, purchaseOrderItemRouter);
  app.use("/v1/sales-orders", Auth, salesOrderRouter);
  app.use("/v1/sales-order-items", Auth, salesOrderItemRouter);
  app.use("/v1/customer-collections", Auth, customerCollectionRouter);
  app.use("/v1/dealer-payments", Auth, dealerPaymentRouter);
}
