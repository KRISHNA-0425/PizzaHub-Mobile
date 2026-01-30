import express from 'express'
import { fetchData, loginCustomer, loginDeliveryPartner, registerCustomer, registerDeliveryPartner } from '../controllers/auth/auth.controllers.js'
import { verifyToken } from '../middleware/auth.middleware.js';

const authRouter = express.Router()

authRouter.post("/loginCustomer", loginCustomer);
authRouter.post("/registerCustomer", registerCustomer);

authRouter.post("/loginDeliveryPartner", loginDeliveryPartner);
authRouter.post("/registerDeliveryPartner", registerDeliveryPartner);

authRouter.get('/fetch', verifyToken, fetchData);

export default authRouter;