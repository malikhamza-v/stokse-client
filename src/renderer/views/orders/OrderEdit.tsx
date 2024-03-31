/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { LabelInput } from '../../components/commonComponents';
import {
  BackButton,
  PrimaryButton,
} from '../../components/commonComponents/buttons';
import { useFetch } from '../../utils/hooks';
import { AddSVG, DeleteSVG, ErrorSVG } from '../../utils/svg';
import { useParams } from 'react-router-dom';

function OrderEdit() {
  // [info]: state
  const [order, setOrder] = useState(null);

  // [info]: hooks
  const { loading: orderFetchLoading, fetchData: orderFetch } = useFetch();
  let params = useParams();

  //   [info]: methods
  const fetchOrder = (id: number) => {
    orderFetch(`/order/${id}/`)
      .then((res) => {
        if (res?.status === 200) {
          console.log('res', res);
          setOrder(res.data);
        }
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  // [info]: lifecycle
  useEffect(() => {
    if (params.id) {
      fetchOrder(params.id as unknown as number);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className=" flex flex-col gap-4 px-10 py-10 h-full w-full bg-slate-50 overflow-y-scroll">
      <BackButton />
      <h2 className="mb-5 text-left  text-4xl font-semibold font-sans">
        Edit :
      </h2>
      <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-2/5 p-8">
          <span className="text-xl font-semibold block">Order Info</span>
          <span className="text-gray-600">
            This information is of this order
          </span>
        </div>
        <div className="w-3/5 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <div className="pb-6">
              <LabelInput
                errorMsg={null}
                label="Order ID"
                loading={false}
                required={false}
              >
                <input
                  type="text"
                  id="name"
                  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4 pointer-events-none"
                  placeholder="Order ID"
                  required
                  //   value={product.product_id}
                  disabled
                />
              </LabelInput>
            </div>
            <div className="pb-6">
              <LabelInput
                // errorMsg={errorMsg.name}
                loading={false}
                label="Name"
                required
              >
                <input
                  type="text"
                  id="name"
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                  placeholder="Product Name"
                  required
                  //   value={userInput.name}
                  onChange={(e) => handleUserInput('name', e.target.value)}
                />
              </LabelInput>
            </div>
            <div className="pb-6">
              <LabelInput
                errorMsg={null}
                label="Product Category"
                loading={false}
                required
              >
                <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                  <svg
                    y="0"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    width="100"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                    height="100"
                    className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                  >
                    <path
                      strokeWidth="4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      fill="none"
                      d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                      className="svg-stroke-primary"
                    />
                  </svg>
                  <select
                    onChange={(e) =>
                      handleUserInput('category', e.target.value)
                    }
                    // value={userInput.category}
                    className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                    id="category"
                  >
                    <option value={undefined} disabled>
                      Select Product Category
                    </option>

                    {/* {categories.map(
                      (category: { id: number; name: string }) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ),
                    )} */}
                  </select>
                </div>
              </LabelInput>
            </div>
            <div className="pb-6">
              <LabelInput
                errorMsg={null}
                loading={false}
                label="Product Brand"
                required
              >
                <div className="relative group rounded-full overflow-hidden before:absolute w-full bg-white border border-gray-300">
                  <svg
                    y="0"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0"
                    width="100"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                    height="100"
                    className="w-8 h-8 absolute right-2 -rotate-45 stroke-pink-300 top-1/2 -translate-y-1/2 group-hover:rotate-0 duration-300"
                  >
                    <path
                      strokeWidth="4"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      fill="none"
                      d="M60.7,53.6,50,64.3m0,0L39.3,53.6M50,64.3V35.7m0,46.4A32.1,32.1,0,1,1,82.1,50,32.1,32.1,0,0,1,50,82.1Z"
                      className="svg-stroke-primary"
                    />
                  </svg>
                  <select
                    // value={userInput.brand}
                    onChange={(e) => handleUserInput('brand', e.target.value)}
                    className="appearance-none hover:placeholder-shown:bg-emerald-500 relative text-pink-400 bg-transparent ring-0 outline-none  placeholder-violet-700 text-sm font-bold rounded-full p-4 focus:ring-violet-500 focus:border-violet-500 block w-full"
                    id="brand"
                  >
                    <option value={undefined} disabled>
                      Select Product Brand
                    </option>
                    {/* {brands.map((brand: { id: number; name: string }) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))} */}
                  </select>
                </div>
              </LabelInput>
            </div>

            <div className="pb-6">
              <LabelInput
                errorMsg={null}
                loading={false}
                label="Product Description"
                required={false}
              >
                <div className="mx-auto">
                  <textarea
                    // value={userInput.description || ''}
                    id="message"
                    rows={4}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 resize-none"
                    placeholder="Product description"
                    onChange={(e) =>
                      handleUserInput('description', e.target.value)
                    }
                  />
                </div>
              </LabelInput>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-full p-8">
          <span className="text-xl font-semibold block">Order Items</span>
          <span className="text-gray-600">
            These are the products placed under this order
          </span>
        </div>
        <div className="w-full p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <table className="min-w-full divide-y divide-gray-200 table w-full">
              <thead className="bg-gray-50 table w-full">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 px-4 text-sm font-normal text-gray-500 w-[10%]"
                  >
                    <button
                      type="button"
                      className="flex items-center gap-x-3 focus:outline-none"
                    >
                      <span>Sr.</span>
                    </button>
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-sm font-normal text-left text-gray-500 w-[20%]"
                  >
                    Name
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-8 text-sm font-normal text-left rtl:text-right text-gray-500 w-[15%] "
                  >
                    Sale Price
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-sm font-normal text-left rtl:text-right text-gray-500 w-[15%] "
                  >
                    Tax
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-3 text-sm font-normal text-left rtl:text-right text-gray-500 w-[20%] "
                  >
                    Discount
                  </th>

                  <th
                    scope="col"
                    className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 w-[10%]"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white block h-[450px] divide-y divide-gray-200 overflow-y-scroll">
                {orderFetchLoading ? (
                  <>
                    {[...Array(7).keys()].map((index) => (
                      <tr className="table w-full" key={index}>
                        <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                          <div>
                            <h2 className="font-medium text-gray-800  ">
                              <div
                                className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              />
                            </h2>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-medium w-[20%]">
                          <div
                            className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </td>
                        <td className="py-4 pl-4 pr-8 text-sm w-[20%]">
                          <div className="flex flex-col gap-2">
                            <div
                              className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm w-[20%]">
                          <div
                            className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </td>

                        <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                          <div
                            className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </td>

                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div
                            className="h-2 bg-gray-300 rounded-2xl animate-pulse"
                            style={{ animationDelay: '0.2s' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : order?.items?.length > 0 ? (
                  order?.items?.map((item: any, index: number) => {
                    return (
                      <tr key={item.id} className="table w-full">
                        <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
                          <div>
                            <p className="text-sm text-wrap  font-normal text-gray-600 mt-2">
                              <span>{index + 1}</span>
                            </p>
                          </div>
                        </td>

                        <td className="py-4 text-sm font-medium w-[20%]">
                          <div className="py-1 text-sm font-normal rounded-full  w-32 text-center">
                            <p className="text-sm text-wrap font-normal text-gray-600 capitalize">
                              <span>{item.name}</span>
                            </p>
                          </div>
                        </td>

                        <td className="py-4 pl-2 text-sm w-[15%]">
                          <div>
                            <h4 className="text-gray-700 ">
                              <span>{item.sale_price}</span>
                            </h4>
                          </div>
                        </td>
                        <td className="py-4 text-sm w-[20%]">
                          <div className="flex items-center">
                            <span>{item.total_tax_amount}</span>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
                          {/* <div>{formatTimestamp(question.created_at)}</div> */}
                        </td>

                        <td>
                          {/* <p className="question-content">{question}</p> */}
                          {/* {isOpen ? <ArrowLeft /> : <ArrowRight />} */}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="table w-full">
                    <td
                      colSpan={6}
                      className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[20%] text-center"
                    >
                      <div className="flex items-center justify-center gap-2 my-2">
                        <ErrorSVG />
                        <h2 className="font-medium text-gray-800  ">
                          No Product Found
                        </h2>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex bg-slate-100 rounded-3xl border border-gray-400">
        <div className="w-2/5 p-8">
          <span className="text-xl font-semibold block">Additional Info</span>
          <span className="text-gray-600">
            Edit additional info of your product
          </span>
        </div>
        <div className="w-3/5 p-8">
          <div className="bg-white rounded-2xl shadow-sm border border-pink-500 p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="">
                <LabelInput
                  errorMsg={null}
                  label="Reorder Quantity"
                  loading={false}
                  required={false}
                >
                  <input
                    type="number"
                    id="reorder_quantity"
                    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full py-4 px-4"
                    placeholder="Reorder Quantity"
                    required
                    onChange={(e) =>
                      handleUserInput('reorder_quantity', e.target.value)
                    }
                    // value={userInput.reorder_quantity}
                  />
                </LabelInput>
              </div>

              <div className="pb-6 pt-2 col-span-2">
                <LabelInput
                  errorMsg={null}
                  label="Additional Note"
                  loading={false}
                  required={false}
                >
                  <div className="mx-auto">
                    <textarea
                      id="additional_notes"
                      rows={2}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 resize-none"
                      placeholder="Additional Note"
                      onChange={(e) =>
                        handleUserInput('additional_notes', e.target.value)
                      }
                      //   value={userInput.additional_notes}
                    />
                  </div>
                </LabelInput>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end w-40 ml-auto">
        <PrimaryButton loading={false} label="Edit" onClickAction={null} />
      </div>
    </div>
  );
}

export default OrderEdit;
