// OrderItem.tsx
'use client';

import React from 'react';
import {Order} from '@/payload-types';

interface OrderItemProps {
  order: Order;
}

const OrderItem: React.FC<OrderItemProps> = ({order}) => {
  return (
    <div className="order-item space-y-2 p-4 border-b border-gray-200">
      <p>
        <strong>Order ID:</strong> {order.id}
      </p>
      <p>
        <strong>Amount:</strong> ${order.totalAmount}
      </p>
      <p>
        <strong>Date:</strong> {new Date(order.createdAt).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })}
      </p>
      {/* Add more order details as needed */}
    </div>
  );
};

export default OrderItem;
