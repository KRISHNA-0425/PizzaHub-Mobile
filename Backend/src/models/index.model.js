
// Created a common index file to export all models

import Branch from "./branch.model";
import Category from "./category.model";
import Order from "./order";
import Product from "./product";
import { Admin, Customer, DeliveryPartner } from "./user.model";

export {
    Order,
    Branch,
    Customer,
    DeliveryPartner,
    Admin,
    Product,
    Category
}