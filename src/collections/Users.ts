import { CollectionConfig } from 'payload/types';
import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: 'verify your account',
          buttonText: 'Verify Account',
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
        });
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      return user && user.role === 'admin';
    },
    update: ({ req: { user } }) => {
      return user && user.role === 'admin';
    },
    delete: ({ req: { user } }) => {
      return user && user.role === 'admin';
    },
  },
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (data.role === 'subadmin' && !data.approved) {
          data.approved = false;
        }
        return data;
      },
    ],
    beforeValidate: [
      ({ req, data }) => {
        if (req.method === 'POST' && data?.role === 'admin') {
          data.approved = true;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Sub-Admin', value: 'subadmin' },
        { label: 'User', value: 'user' },
      ],
    },
    {
      name: 'approved',
      type: 'checkbox',
      label: 'Approved',
      defaultValue: false,
    },
  ],
};
