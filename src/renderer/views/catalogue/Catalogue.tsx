/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-nested-ternary */
import RecentOrders from '../../components/viewComponents/catalogue/RecentOrders';
import RecentCustomer from '../../components/viewComponents/catalogue/RecentCustomers';

/* eslint-disable jsx-a11y/control-has-associated-label */
export default function Catalogue() {
  return (
    <section className="container p-10 mx-auto overflow-y-scroll flex flex-col gap-20">
      <RecentOrders />
      <RecentCustomer />
    </section>
  );
}
