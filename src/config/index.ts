export const PRODUCT_CATEGORIES = [
    {
      label: 'Categories',
      value: 'Categories' as const,
      featured: [
        {
          name: 'Seafood',
          href: '/products?category=seafood',
        },
        {
          name: 'Fresh Produces',
          href: '/products?category=fresh_produce',
        },
        {
          name: 'Meat and Poultry',
          href: '/products?category=meat_poultry',
        },
        {
          name: "Kellogg's",
          href: `/products?category=kelloggs`,
        },
        {
          name: 'Nestlé',
          href: '/products?category=nestlé',
        },
        {
          name: 'Coca-Cola',
          href: '/products?category=coca_cola',
        },
      ],
    },
    {
      label: 'Brands',
      value: 'brands' as const,
      featured: [
        {
          name: "Kellogg's",
          href: `/products?brands=kellogg`,
        },
        {
          name: 'Nestlé',
          href: '/products?brands=Nestlé',
        },
        {
          name: 'Coca-Cola',
          href: '/products?brands=Coca-Cola',
        },
      ],
    },
  ]