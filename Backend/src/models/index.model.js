
// Created a common index file to export all models

import Branch from "./branch.model.js";
import Category from "./category.model.js";
import Order from "./order.model.js";
import Product from "./product.model.js";
import { Admin, Customer, DeliveryPartner, User } from "./user.model.js";

export {
    Order,
    Branch,
    Customer,
    DeliveryPartner,
    Admin,
    Product,
    Category,
    User
}