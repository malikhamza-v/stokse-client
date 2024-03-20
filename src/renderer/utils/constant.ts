import { HomeSVG, InventorySVG, ProfileSVG, SaleSVG, TableSVG } from './svg';

const Navbar = [
  {
    label: 'Dashboard',
    icon: HomeSVG,
    link: '/',
  },
  {
    label: 'Customer',
    icon: ProfileSVG,
    link: '/customer',
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
    icon: TableSVG,
    link: '/',
  },
];

export default Navbar;
