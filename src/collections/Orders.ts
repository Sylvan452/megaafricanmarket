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
      required: false,
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
        },
      ],
    },
    {
      name: '_isPaid',
      type: 'checkbox',
      access: {
        read: ({ req }) => req.user.role === 'admin',
      },
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      options: [
        {
          label: 'Pick Up',
          value: 'pickup',
        },
        {
          label: 'Shipping',
          value: 'ship',
        },
      ],
      required: true,
      // access: {
      //   read: ({ req }) => req.user.role === 'admin',
      // },
    },

    {
      name: 'deliveryDetails',
      type: 'group', // required
      fields: [
        // required
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'country',
          type: 'text',
        },
        {
          name: 'city',
          type: 'text',
        },
        {
          name: 'address',
          type: 'text',
        },
      ],
    },
    {
      name: 'totalAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentIntent',
      type: 'text',
      access: {
        read: () => true,
        update: () => false,
        create: () => false,
      },
      // required: true,
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
      return true
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
