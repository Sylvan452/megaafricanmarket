import { CollectionConfig } from 'payload/types'


export const Users: CollectionConfig = {
    slug: 'users',
    auth: {
        verify: {
          generateEmailHTML: ({ token }) => {
            return `<a href='${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}'>Verify Account</a>`
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
    }