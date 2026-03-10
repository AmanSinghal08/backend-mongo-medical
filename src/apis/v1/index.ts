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

export function mount(app: Application): void {
  app.use("/v1", IndexRouter);
  app.use("/v1/auth", AuthRouter);
  app.use("/v1/inventory", inventoryRouter);
  app.use("/v1/products", productRouter);
  app.use("/v1/brands", brandRouter);
  app.use("/v1/customers", customerRouter);
  app.use("/v1/dealers", dealerRouter);
  app.use("/v1/purchase-orders", purchaseOrderRouter);
  app.use("/v1/purchase-order-items", purchaseOrderItemRouter);
  app.use("/v1/sales-orders", salesOrderRouter);
  app.use("/v1/sales-order-items", salesOrderItemRouter);
  app.use("/v1/customer-collections", customerCollectionRouter);
  app.use("/v1/dealer-payments", dealerPaymentRouter);
}
