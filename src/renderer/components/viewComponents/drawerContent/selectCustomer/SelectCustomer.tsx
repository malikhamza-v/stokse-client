import { useState } from 'react';

function SelectCustomer() {
  const [isIntendedToAddCustomer, setIsIntendedToAddCustomer] = useState(false);
  // [info]: methods
  const handleAddCustomer = () => {
    const drawer = document.querySelector('.category-drawer');
    if (drawer) {
      if (isIntendedToAddCustomer) {
        drawer.style.width = '45vw ';
      } else {
        drawer.style.width = '55vw ';
      }
    }
    setIsIntendedToAddCustomer(!isIntendedToAddCustomer);
  };

  return (
    <div
      className="h-full hover:bg-purple-100 cursor-pointer transition-all duration-300 col-span-6"
      onClick={handleAddCustomer}
      role="button"
      tabIndex={0}
      aria-hidden="true"
    >
      <div className="flex flex-col gap-2 justify-center items-center py-8 px-4">
        <div>
          <img
            src="https://api.dicebear.com/9.x/fun-emoji/svg?seed=Eliza&radius=50"
            alt="customer_avatar"
            className="w-16 h-16"
          />
        </div>
        <p className="font-medium mt-2">Add Customer</p>
        <p className="text-center text-gray-500">Or leave empty for walk-ins</p>
      </div>
    </div>
  );
}

export default SelectCustomer;
