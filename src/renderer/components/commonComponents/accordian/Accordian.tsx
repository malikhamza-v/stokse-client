/* eslint-disable no-nested-ternary */
import React, { RefObject, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ErrorSVG } from '../../../utils/svg';
import { formatTimestamp } from '../../../utils/methods';
import { PrimaryButton } from '../buttons';
import { useCreate } from '../../../utils/hooks';
import { toast } from 'react-toastify';

interface Order {
  id: number;
  payment_status: string;
  total: number;
  payment_methods: {
    method: string;
  }[];
  created_at: string;
}

function AccordionItem({
  order,
  isOpen,
  onClick,
}: {
  order: Order;
  isOpen: boolean;
  onClick: any;
}) {
  const contentHeight = useRef<any>();

  const { createData: sendInvoice, loading: sendInvoiceLoading } = useCreate();

  const handleSendInvoice = (order_id: number) => {
    sendInvoice(`order/${order_id}/send-invoice/`, null, false)
      .then(() => {
        toast.success('Email sent successfully!');
        return true;
      })
      .catch(() => {
        toast.error('Something went wrong!');
      });
  };
  return (
    <div className="wrapper">
      <button
        type="button"
        className={`question-container ${isOpen ? 'active' : ''}`}
        onClick={onClick}
      >
        <td className="px-4 py-4 text-sm font-medium whitespace-pre-wrap w-[10%]">
          <div>
            <p className="text-sm text-wrap  font-normal text-gray-600 mt-2">
              <span>{order.id}</span>
            </p>
          </div>
        </td>

        <td className="py-4 text-sm font-medium w-[20%]">
          <div className="py-1 text-sm font-normal rounded-full text-emerald-500 bg-emerald-100/60 w-32 text-center">
            <p className="text-sm text-wrap font-normal text-gray-600 capitalize">
              <span>{order.payment_status}</span>
            </p>
          </div>
        </td>

        <td className="py-4 pl-2 text-sm w-[15%]">
          <div>
            <h4 className="text-gray-700 ">
              <span>{order.total}</span>
            </h4>
          </div>
        </td>
        <td className="py-4 text-sm w-[20%]">
          <div className="flex items-center">
            <ul className="text-gray-500 list-none flex items-center gap-2">
              {order.payment_methods.map((method: any) => {
                return (
                  <li className="font-bold px-2 border rounded">
                    {method.method}
                  </li>
                );
              })}
            </ul>
          </div>
        </td>

        <td className="px-4 py-4 text-sm whitespace-nowrap w-[10%]">
          <div>{formatTimestamp(order.created_at)}</div>
        </td>

        <td>{isOpen ? <ArrowLeft /> : <ArrowRight />}</td>
      </button>

      <div
        ref={contentHeight}
        className="answer-container"
        style={
          isOpen
            ? { height: contentHeight.current?.scrollHeight }
            : { height: '0px' }
        }
      >
        <div className="flex gap-2 justify-end pb-2">
          <div>
            <PrimaryButton
              loading={false}
              onClickAction={null}
              label="View Order"
            />
          </div>
          <div>
            <PrimaryButton
              label="Send Receipt"
              loading={sendInvoiceLoading}
              onClickAction={() => handleSendInvoice(order.id)}
            />
          </div>
          <div>
            <PrimaryButton
              label="Refund"
              loading={false}
              onClickAction={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ orders }: { orders: any }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isLoading = false;
  const handleItemClick = (index: number) => {
    const newIndex = activeIndex === index ? null : index;
    setActiveIndex(newIndex);
  };

  return (
    <div className="container">
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
              className="py-3.5 px-10 text-sm font-normal text-left text-gray-500 w-[20%]"
            >
              Status
            </th>

            <th
              scope="col"
              className="py-3.5 pl-4 pr-8 text-sm font-normal text-left rtl:text-right text-gray-500 w-[15%] "
            >
              Total
            </th>

            <th
              scope="col"
              className="py-3.5 px-3 text-sm font-normal text-left rtl:text-right text-gray-500 w-[20%] "
            >
              Payment Methods
            </th>

            <th
              scope="col"
              className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 w-[10%]"
            >
              Date
            </th>

            <th scope="col" className="relative py-3.5 px-4 w-[5%]">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white block h-[450px] divide-y divide-gray-200 overflow-y-scroll">
          {isLoading ? (
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
          ) : orders?.length > 0 ? (
            <>
              {orders.map((order: Order, index: number) => {
                return (
                  <tr key={order.id} className="table w-full">
                    <AccordionItem
                      key={order.id}
                      order={order}
                      isOpen={activeIndex === index}
                      onClick={() => handleItemClick(index)}
                    />
                  </tr>
                );
              })}
            </>
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
  );
}

export default Accordion;
