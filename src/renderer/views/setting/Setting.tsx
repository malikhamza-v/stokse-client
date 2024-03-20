import { Link } from 'react-router-dom';
import { LabelInput } from '../../components/commonComponents';
import { ArrowRight } from '../../utils/svg';

function Setting() {
  const settingsOptions = [
    {
      label: 'Categories',
      description: 'Manage categories of your products.',
      link: '/categories',
    },
    {
      label: 'Brands',
      description: 'Manage brands of your products.',
      link: '/brands',
    },
    {
      label: 'Payment Methods',
      description: 'Manage payment methods of your store.',
      link: '/payment-methods',
    },
    {
      label: 'Taxes',
      description: 'Manage default taxes of your store.',
      link: '/taxes',
    },
  ];
  return (
    <div className="flex flex-col h-full w-full overflow-y-scroll">
      {/* <div className="px-16 pt-16 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl">Setting</h2>
          <p className="text-gray-500">Manage you store settings here.</p>
        </div>
      </div> */}
      <div className="px-16 py-8">
        <div className="relative mx-auto break-words bg-white w-full mb-6 rounded-xl mt-16">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative">
                  <img
                    src="https://placehold.co/230x230"
                    className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 max-w-[150px]"
                    alt="business-logo"
                  />
                </div>
              </div>
            </div>
            <div className="text-center mt-24">
              <h3 className="text-2xl text-slate-700 font-bold leading-normal mb-1">
                Store Name
              </h3>
              <div className="text-xs mt-0 mb-2 text-slate-400 font-bold uppercase">
                Paris, France
              </div>
            </div>
            <div className="mt-6 py-6 border-t border-slate-200 text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full">
                  <div className="bg-white rounded-2xl shadow-sm py-6 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <div className="grid grid-cols-2 gap-4">
                        <LabelInput
                          loading={false}
                          errorMsg={null}
                          label="Name"
                          required
                        >
                          <input
                            type="text"
                            id="name"
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                            placeholder="Store Name"
                            required
                            // onChange={(e) =>
                            //   handleUserInput('name', e.target.value)
                            // }
                          />
                        </LabelInput>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <LabelInput
                        loading={false}
                        errorMsg={null}
                        label="Business Description"
                        required
                      >
                        <input
                          type="number"
                          id="name"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                          placeholder="Business Description"
                          required
                          // onChange={(e) =>
                          //   handleUserInput('name', e.target.value)
                          // }
                        />
                      </LabelInput>
                    </div>
                    <div className="">
                      <LabelInput
                        loading={false}
                        errorMsg={null}
                        label="Business Email"
                        required
                      >
                        <input
                          type="text"
                          id="name"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                          placeholder="Business Email"
                          required
                          // onChange={(e) =>
                          //   handleUserInput('name', e.target.value)
                          // }
                        />
                      </LabelInput>
                    </div>
                    <div className="">
                      <LabelInput
                        loading={false}
                        errorMsg={null}
                        label="Business Phone"
                        required
                      >
                        <input
                          type="number"
                          id="name"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                          placeholder="Business Phone"
                          required
                          // onChange={(e) =>
                          //   handleUserInput('name', e.target.value)
                          // }
                        />
                      </LabelInput>
                    </div>

                    <div className="col-span-2">
                      <LabelInput
                        loading={false}
                        errorMsg={null}
                        label="Business Address"
                        required
                      >
                        <input
                          type="number"
                          id="name"
                          className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                          placeholder="Business Address"
                          required
                          // onChange={(e) =>
                          //   handleUserInput('name', e.target.value)
                          // }
                        />
                      </LabelInput>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 flex flex-col">
            <div>
              <h2 className="font-bold text-2xl">Settings</h2>
              <p className="text-gray-500">
                Manage your store settings effortlessly.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {settingsOptions.map((option) => (
                <Link to={option.link} key={option.link}>
                  <div className="border p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50">
                    <div>
                      <p className="font-bold">{option.label}</p>
                      <p className="text-gray-600">{option.description}</p>
                    </div>
                    <ArrowRight />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
