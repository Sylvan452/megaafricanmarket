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
        name: 'Meat/Chicken/Fish',
        href: '/products?category=meat_chicken_fish',
      },
      {
        name: 'Frozen Food/Vegetable',
        href: `/products?category=frozen_food_vegetable`,
      },
      {
        name: 'Canned Products',
        href: '/products?category=canned_products',
      },
      {
        name: 'Spices/Seasonings',
        href: '/products?category=spices_seasonings',
      },
      {
        name: 'Oil',
        href: '/products?category=oil',
      },
      {
        name: 'Flour',
        href: '/products?category=flour',
      },
      {
        name: 'Dried Seeds/Leaves',
        href: '/products?category=dried_seeds_leaves',
      },
      {
        name: 'Garri/Grains/Beans',
        href: '/products?category=garri_grains_beans',
      },
      {
        name: 'Rice/Noodles/Pasta',
        href: '/products?category=rice_noodles_pasta',
      },
      {
        name: 'Breakfast/Cereal',
        href: '/products?category=breakfast_cereal',
      },
      {
        name: 'Bakery/Bread',
        href: '/products?category=bakery_bread',
      },
      {
        name: 'Beauty Supplies/Cosmetics',
        href: '/products?category=beauty_supply_cosmetics',
      },
      {
        name: 'Clothes/Accessories',
        href: '/products?category=clothes_accessorie',
      },
      {
        name: 'Kitchen/Household Utensils',
        href: '/products?category=kitchen_household_utensils',
      },
      {
        name: 'Snacks',
        href: '/products?category=snacks',
      },
      {
        name: 'Drinks/Beverages',
        href: '/products?category=drinks_beverages',
      },
      {
        name: 'Others',
        href: '/products?category=others',
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
];
