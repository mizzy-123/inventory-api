import { Router } from "express";
import { UserController } from "../controller/user-controller";
import { adminMiddleware } from "../middleware/admin-middleware";
import { checkUniqueEmail } from "../middleware/check-unique-email-middleware";
import upload from "../utils/multer";
import { SupplierController } from "../controller/supplier-contoller";
import { WarehouseController } from "../controller/warehouse-controller";
import { adminAndManagerMiddleware } from "../middleware/admin-and-manager-middeware";
import { InventoryController } from "../controller/inventory-controller";
import { ItemController } from "../controller/item-controller";

export const apiRouter = Router();

// User API
apiRouter.post("/users/profile", upload.single("photo"), UserController.updateUserProfile);
apiRouter.get("/users/profile", UserController.getUserProfile);
apiRouter.put("/users/password", UserController.changePassword);
apiRouter.post("/users", adminMiddleware, checkUniqueEmail, UserController.createUser);
apiRouter.post("/users/:id/role", adminMiddleware, UserController.updateUserRole);

// Supplier
apiRouter.post("/supplier", adminAndManagerMiddleware, SupplierController.CreateSupplier);
apiRouter.put("/supplier/:id", adminAndManagerMiddleware, SupplierController.UpdateSupplier);
apiRouter.get("/supplier", adminAndManagerMiddleware, SupplierController.getSupplier);

// Warehouse
apiRouter.get("/warehouse", adminMiddleware, WarehouseController.getWarehouse);
apiRouter.post("/warehouse", adminMiddleware, WarehouseController.createWarehouse);
apiRouter.put("/warehouse/:id", adminMiddleware, WarehouseController.updateWarehouse);
apiRouter.delete("/warehouse/:id", adminMiddleware, WarehouseController.deleteWarehouse);

// Item
apiRouter.post("/item", adminAndManagerMiddleware, ItemController.createItem);
apiRouter.put("/item/:id", adminAndManagerMiddleware, ItemController.updateItem);
apiRouter.get("/item", adminAndManagerMiddleware, ItemController.getAllItem);
apiRouter.delete("/item/:id", adminAndManagerMiddleware, ItemController.deleteItem);

// Inventory
apiRouter.post("/inventory", InventoryController.createInventory);
apiRouter.put("/inventory/:id/transfer", InventoryController.transferInventory);
// apiRouter.delete("/inventory/:id/item", adminAndManagerMiddleware);
// apiRouter.get("/inventory");
