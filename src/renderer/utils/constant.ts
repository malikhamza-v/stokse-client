import {
  HomeSVG,
  InventorySVG,
  ProfileSVG,
  SaleSVG,
  TableSVG,
  MoreSVG,
  SettingSVG,
  OrderBox,
  CustomerSVG,
} from './svg';

const Navbar = [
  {
    label: 'Dashboard',
    icon: HomeSVG,
    link: '/',
  },
  {
    label: 'Employees',
    icon: ProfileSVG,
    link: '/employees',
  },
  {
    label: 'Sale',
    icon: SaleSVG,
    link: '/sale',
  },
  {
    label: 'Inventory',
    icon: InventorySVG,
    link: '/inventory',
  },
  {
    label: 'Catalogue',
    description: 'Explore all the catalogues of your store',
    icon: TableSVG,
    link: '/catalogue',
    isHiddenForMobile: true,
    options: [
      {
        label: 'Orders',
        description: 'Explore all the orders of your store',
        icon: OrderBox,
        link: '/catalogue/order-list',
      },
      {
        label: 'Customers',
        description: 'Explore all the customers of your store',
        icon: CustomerSVG,
        link: '/catalogue/customers',
      },
    ],
  },
  {
    label: 'Settings',
    description: 'Explore all the settings of your store',
    icon: SettingSVG,
    link: '/setting',
    isHiddenForMobile: true,
  },
];

const noTaxOptions: readonly {
  value: string;
  label: string;
  color: string;
  isDisabled: boolean;
}[] = [
  {
    value: 'No Tax Found',
    label: 'No Tax Found',
    color: '#000',
    isDisabled: true,
  },
];

const noStoreOptions: readonly {
  value: string;
  label: string;
  color: string;
  isDisabled: boolean;
}[] = [
  {
    value: 'No Store Found',
    label: 'No Store Found',
    color: '#000',
    isDisabled: true,
  },
];

const data = [
  {
    id: 35,
    items: [
      {
        id: 2,
        category: {
          id: 3,
          name: 'Men Clothes',
        },
        brand: {
          id: 2,
          name: 'Gucci',
        },
        total_price: '169.50',
        product_id: '3-001',
        name: 'Men Trouser',
        description: 'this is the men trouser',
        cost_price: '130.00',
        sale_price: '150.00',
        stock_quantity: 30,
        enable_low_stock_notification: true,
        low_stock_level: 40,
        reorder_quantity: 30,
        additional_notes: 'this is the additional note',
        taxes: [
          {
            name: 'GST',
            percent: '10',
            amount: 15,
          },
          {
            name: 'PST',
            percent: '3',
            amount: 4.5,
          },
        ],
        created_at: '2024-03-23T20:43:32.602915Z',
        updated_at: '2024-03-23T20:43:32.603393Z',
        store: 23,
        qty: 1,
      },
      {
        id: 1,
        category: {
          id: 1,
          name: 'Women Clothes',
        },
        brand: {
          id: 1,
          name: 'Hamza',
        },
        total_price: '1300.00',
        product_id: '1-001',
        name: 'Women Clothing',
        description: 'this is the product description',
        cost_price: '1200.00',
        sale_price: '1300.00',
        stock_quantity: 50,
        enable_low_stock_notification: false,
        low_stock_level: null,
        reorder_quantity: 10,
        additional_notes: 'check',
        taxes: null,
        created_at: '2024-03-23T19:20:42.703138Z',
        updated_at: '2024-03-23T19:20:42.703235Z',
        store: 23,
        qty: 1,
      },
    ],
    sub_total: '1469.50',
    order_discount: '0.00',
    tip: '0.00',
    total: '1469.50',
    payment_methods: [
      {
        amount: '1000',
        method: 'Cash',
      },
      {
        amount: '1000',
        method: 'Card',
      },
    ],
    tax: [],
    payment_status: 'completed',
    created_at: '2024-03-28T16:18:31.677193Z',
    updated_at: '2024-03-28T16:18:31.677232Z',
    store: 23,
    customer: 3,
  },
];

export { noTaxOptions, noStoreOptions, Navbar, data };
