import { useEffect, useState } from "react";
import { Orders } from "../../Services/api";
import { Order as OrderType } from "../../Types/OrderTypes";
import { Link } from "react-router-dom";
import OrderRow from "./Order";

const AllOrders = () => {
  const [orders, setorder] = useState<OrderType[]>([]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData: OrderType[] = await Orders();
        setorder(orderData);
      } catch (error) {
        console.error("Failed to fetch order", error);
      }
      console.log("first");
    };

    fetchOrder();
  }, []);

  return (
    <div className="px-7 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">order</h1>
        <Link
          to="/order/new"
          className="flex items-center justify-center px-4 py-2 bg-black text-white rounded"
        >
          Add order
        </Link>
      </div>
      <div className="bg-gray-300 w-full mt-10 p-6 rounded">
        <table className="min-w-full divide-y divide-black">
          <thead className="text-sm">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black text-sm">
            {orders.map((order) => (
              <OrderRow {...order} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
