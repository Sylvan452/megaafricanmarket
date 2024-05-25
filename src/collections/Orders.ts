import { CollectionConfig } from 'payload/types';

const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Order',
    plural: 'Orders',
  },
  fields: [
    {
      name: 'orderedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }) => req.user.role === 'admin',
      }
    },
    {
      name: 'createdAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        disabled: true, // Optionally, you can hide this field from the admin UI if not needed.
      },
    },
    // Add other fields as needed
  ],
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === 'admin') {
        return true; // Admin can read all orders
      }

      return {
        orderedBy: {
          equals: user?.id,
        },
      };
    },
    // Define create, update, and delete access as needed
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (!data.createdAt) {
          data.createdAt = new Date().toISOString();
        }
        return data;
      },
    ],
  },
};

export default Orders;
