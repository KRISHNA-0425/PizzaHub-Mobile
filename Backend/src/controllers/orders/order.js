import { Customer, DeliveryPartner } from '../../models/user.model.js';
import Branch from '../../models/branch.model.js'
import Order from '../../models/order.model.js';

export const createOrder = async (req, res) => {
    try {
        const { userId } = req.user

        const { items, branch, totalAmount } = req.body

        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch)

        if (!customerData) {
            return res.status(404).json({ message: "Customer not found" });
        }

        if (!branchData) {
            return res.status(404).json({ message: "Branch not found" });
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((product) => ({
                id: product.id,
                product: product.product,
                quantity: product.quantity
            })),
            branch: branch,
            totalAmount: totalAmount,
            deliverLocation: {
                longitude: customerData.liveLocation.longitude,
                latitude: customerData.liveLocation.latitude,
                address: customerData.address || "no address available",
            },
            pickupLocation: {
                longitude: branchData.location.longitude,
                latitude: branchData.location.latitude,
                address: branchData.address || "no address available",
            },
            status: "pending"
        })

        const savedOrder = await newOrder.save()

        return res.status(201).json({
            message: "Order created successfully",
            order: savedOrder
        })

    } catch (error) {
        console.error('Error creating order:', error)
        return res.status(500).json({
            message: 'Internal server error in creating order',
            error: error.message
        })
    }
};

export const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { userId } = req.user;
        const { deliveryPartnerLocation } = req.body

        const deliveryPartner = await DeliveryPartner.findById(userId)

        if (!deliveryPartner) {
            return res.status(404).json({ message: "Delivery partner not found" });
        }

        const order = await Order.findById(orderId)

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Fixed: Changed from "available" to "pending" to match createOrder status
        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Order is not available for confirmation",
                currentStatus: order.status
            });
        }

        order.status = "confirmed"
        order.deliveryPartner = userId
        order.deliveryPartnerLocation = {
            longitude: deliveryPartnerLocation.longitude,
            latitude: deliveryPartnerLocation.latitude,
            address: deliveryPartner.address || "no address available",
        }

        // Save first before emitting
        await order.save()

        // Emit socket event after successful save
        if (req.server?.io) {
            req.server.io.to(orderId).emit('orderConfirmed', order)
        }

        return res.status(200).json({
            message: "Order confirmed successfully",
            order: order
        })

    } catch (error) {
        console.error('Error confirming order:', error)
        return res.status(500).json({
            message: 'Internal server error in confirming order',
            error: error.message
        })
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { userId } = req.user;
        const { status, deliveryPartnerLocation } = req.body;
        const { orderId } = req.params;

        const deliveryPartner = await DeliveryPartner.findById(userId)
        if (!deliveryPartner) {
            return res.status(404).json({ message: "Delivery partner not found" });
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Fixed: Changed from includes([array]) to array.includes(value)
        if (["delivered", "cancelled"].includes(order.status)) {
            return res.status(400).json({ message: "Order is already delivered or cancelled" });
        }

        // The delivery partner can only update the order status if he is the one who confirmed the order
        if (order.deliveryPartner.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to update this order" });
        }

        // Validate status transition (optional but recommended)
        const validStatuses = ["confirmed", "arriving", "delivered", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status",
                validStatuses: validStatuses
            });
        }

        order.status = status

        // Only update location if provided
        if (deliveryPartnerLocation) {
            order.deliveryPartnerLocation = {
                longitude: deliveryPartnerLocation.longitude,
                latitude: deliveryPartnerLocation.latitude,
                address: deliveryPartnerLocation.address || order.deliveryPartnerLocation?.address || "no address available"
            };
        }

        await order.save()

        // Emit socket event after successful save
        if (req.server?.io) {
            req.server.io.to(orderId).emit('liveTrackingUpdated', order);
        }

        return res.status(200).json({
            message: "Order status updated successfully",
            order: order
        })

    } catch (error) {
        console.error('Error updating order status:', error)
        return res.status(500).json({
            message: 'Internal server error in updating order status',
            error: error.message
        })
    }
};

export const getOrders = async (req, res) => {
    try {
        const { status, customerId, deliveryPartnerId, branchId } = req.query

        let query = {}

        if (status) query.status = status
        if (customerId) {
            // Validate ObjectId format to prevent errors
            if (!customerId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid customer ID format" });
            }
            query.customer = customerId
        }
        if (deliveryPartnerId) {
            if (!deliveryPartnerId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid delivery partner ID format" });
            }
            query.deliveryPartner = deliveryPartnerId
        }
        if (branchId) {
            if (!branchId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(400).json({ message: "Invalid branch ID format" });
            }
            query.branch = branchId
        }

        const orders = await Order.find(query)
            .populate('customer', 'name email')
            .populate('branch', 'name address')
            .populate('deliveryPartner', 'name email')
            .populate('items.product', 'name price image') // Populate product details in items
            .sort({ createdAt: -1 }) // Most recent orders first
            .lean() // Better performance for read-only data

        return res.status(200).json({
            message: "Orders fetched successfully",
            count: orders.length,
            orders: orders
        })

    } catch (error) {
        console.error('Error fetching orders:', error)
        return res.status(500).json({
            message: 'Internal server error in getting orders',
            error: error.message
        })
    }
};
