export const PRODUCT_CATEGORIES = [
    {
      label: 'Categories',
      value: 'Categories' as const,
      featured: [
        {
          name: 'Seafood',
          href: `/products?category=Seafood`,
        },
        {
          name: 'Fresh Produces',
          href: '/products?category=Fresh_Produce&sort=desc',
        },
        {
          name: 'Meat and Poultry',
          href: '/products?category=meat_poultry',
        },
      ],
    },
    {
      label: 'Brands',
      value: 'brands' as const,
      featured: [
        {
          name: 'Kellogg',
          href: `/products?brands=kellogg`,
        },
        {
          name: 'Nestlé',
          href: '/products?brands=Nestlé',
        },
        {
          name: 'Coca-Cola',
          href: '/products?brands=Coca-Cola          ',
        },
      ],
    },
  ]