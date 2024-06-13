// MyOrders.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import Image from 'next/image';
import OrderItem from './OrderItem';
import { Order, User } from '@/payload-types';

interface MyOrdersProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ user, isOpen, onClose }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
          console.log("in effect")
    if (isMounted) {
          console.log("is mounted")
      const fetchOrders = async () => {
        try {
          const url = `/api/orders?user=${
            user.id
          }&timestamp=${new Date().getTime()}`;
          const response = await fetch(url, {
            headers: {
              'If-None-Match': localStorage.getItem('ordersEtag') || '',
            },
          });

          if (response.status === 304) {
            console.log('No new data, using cached orders.');
            return;
          }

          const data = await response.json();
          console.log("orders fetched", data)
          setOrders(data.docs);

          const etag = response.headers.get('etag');
          if (etag) {
            localStorage.setItem('ordersEtag', etag);
          }
        } catch (error) {
          console.error('Failed to fetch orders:', error);
        }
      };

      fetchOrders();
    }
  }, [isMounted, user.id]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>My Orders</SheetTitle>
        </SheetHeader>
        {orders?.length > 0 ? (
          <>
            <div className="flex w-full flex-col pr-6">
              <ScrollArea className="h-96">
                {orders.map((order) => (
                  <OrderItem key={order.id} order={order} />
                ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex">
                  <span className="flex-1">Total Orders</span>
                  <span>{orders.length}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <div
              aria-hidden="true"
              className="relative mb-4 h-60 w-60 text-muted-foreground"
            >
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="empty shopping cart hippo"
              />
            </div>
            <div className="text-xl font-semibold">No orders found</div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MyOrders;
