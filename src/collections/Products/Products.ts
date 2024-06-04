import { BeforeChangeHook } from 'payload/dist/collections/config/types';
import { CollectionConfig } from 'payload/types';
import { Product } from '../../payload-types'
import { stripe } from '../../lib/stripe';


export const PRODUCT_CATEGORIES = [
  {
    label: 'Seafood',
    value: 'seafood',
  },
  {
    label: 'Fresh Produces',
    value: 'fresh_produce',
  },
  {
    label: 'Meat/Chicken/Fish',
    value: 'meat_chicken_fish',
  },
  {
    label: "Frozen Food/Vegetable",
    value: 'frozen_food_vegetable',
  },
  {
    label: 'Canned Products',
    value: 'canned_products',
  },
  {
    label: 'Spices',
    value: 'spices',
  },
  {
    label: 'Spices',
    value: 'spices',
  },
  {
    label: 'Spices',
    value: 'spices',
  },
];

export const PRODUCT_BRANDS = [ // Change the variable name to PRODUCT_BRANDS
  "Kellogg's", // Directly store the brand names
  'Nestlé',
  'Coca-Cola',
];

const addUser: BeforeChangeHook<Product> = async ({req, data}) => {
  const user = req.user

  return {...data, user: user.id}
}
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: ({ req: { user } }) => {
      return user && (user.role === 'admin' || user.role === 'subadmin');
    },
    read: () => true,
    update: ({ req: { user } }) => {
      return user && (user.role === 'admin' || user.role === 'subadmin');
    },
    delete: ({ req: { user } }) => {
      return user && user.role === 'admin';
    },
  },
  hooks: {
    beforeChange: [addUser, async (args) =>{
      if(args.operation === 'create') {
        const data = args.data as Product

        const createdProduct = await stripe.products.create({
          name: data.name,
          default_price_data: {
            currency: 'USD',
            unit_amount: Math.round(data.price * 100),
          }
        })
        const updated: Product = {
          ...data,
          stripeId: createdProduct.id,
          priceId: createdProduct.default_price as string
        }

        return updated
      } else if(args.operation === 'update') {
        const data = args.data as Product

        const updatedProduct = await stripe.products.update(data.stripeId!, {
          name: data.name,
          default_price: data.priceId!,
        })
        const updated: Product = {
          ...data,
          stripeId: updatedProduct.id,
          priceId: updatedProduct.default_price as string
        }

        return updated

      }
    },
  ],
  },
  
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        condition: () => true,
        hidden: false,
      },
    },
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product details',
    },
    {
      name: 'price',
      label: 'Price in USD',
      min: 0,
      max: 1000,
      type: 'number',
      required: true,
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({
        label,
        value,
      })),
      required: true,
    },
    {
      name: 'brandCategory',
      label: 'Brand Category',
      type: 'select',
      options: PRODUCT_BRANDS.map((brand) => ({ // Use PRODUCT_BRANDS directly
        label: brand,
        value: brand.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '_'), // Convert to lowercase and replace special characters
      })),
      required: false,
    },
    {
      name: 'priceId',
      access: {
        create: () => true,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'stripeId',
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product images',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Image',
        plural: 'Images',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ]
    }
  ],
};
