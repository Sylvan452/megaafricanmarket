import { CollectionConfig } from 'payload/types';
import { PrimaryActionEmailHtml } from '../components/emails/PrimaryActionEmail';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token }) => {
        console.log('verify email, generation');
        return PrimaryActionEmailHtml({
          actionLabel: 'Verify Your Account',
          buttonText: 'Verify Your Account',
          href: `${
            process.env.NEXT_PUBLIC_SERVER_URL ||
            'https://www.megaafricanmarket.com'
          }/verify-email?token=${token}`,
        });
      },
    },
    forgotPassword: {
      generateEmailHTML: ({ req, token, user }) => {
        console.log('forgot password, generation');
        return PrimaryActionEmailHtml({
          actionLabel: 'Reset Your Password',
          buttonText: 'Reset Password',
          href: `${
            process.env.NEXT_PUBLIC_SERVER_URL ||
            'https://www.megaafricanmarket.com'
          }/change-password?token=${token}`,
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
