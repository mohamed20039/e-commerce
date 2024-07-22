import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Order as OrderType } from "../../Types/OrderTypes";
import { specificOrder } from "../../Services/api";

const Order = () => {
  const [order, setOrder] = useState<OrderType | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchOrder = async () => {
      if (id) {
        try {
          const orderData = await specificOrder(id);
          setOrder(orderData);
        } catch (error) {
          console.error("Failed to fetch order", error);
          setError("Failed to fetch order. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="px-7 py-4">
      {order ? (
        <div>
          <div className="flex gap-3 items-center">
            <h1 className="text-sm">Order Details</h1>
            <p className="text-base lowercase bg-yellow-100 px-2 rounded-md">
              Payment {order.paymentStatus}
            </p>
            <p>
              <span className="text-base lowercase bg-yellow-100 px-2 rounded-md">
                Order Status {order.orderStatus}
              </span>
            </p>
          </div>
          <div>
            <div className="bg-gray-200 p-4 rounded-md space-y-5 mt-5 w-3/4">
              <span className="text-base lowercase bg-yellow-100 px-2 rounded-md">
                Order Status {order.orderStatus} ({order.items.length})
              </span>
              <div>
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center p-4 rounded-s-sm mb-4 relative"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.productName}
                        className="w-8 h-8 rounded-xl"
                      />
                      <div className="absolute top-2 left-2 bg-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-white text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="ml-4 flex-1 text-sm">
                      <h2>{item.product.productName}</h2>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-sm">
                        {item.product.productPrice} x {item.quantity}
                      </div>
                      <div className="text-sm">
                        ${item.product.productPrice * item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
                <hr className="border-t-2 border-black" />
              </div>
              <div className="flex justify-between text-black">
                <div></div>
                <button className="bg-black text-white px-7 rounded-md py-2 text-sm flex items-center justify-center">
                  Fulfill Items
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-gray-200 p-4 rounded-md space-y-5 mt-5 w-3/4">
              <span className="text-base lowercase bg-yellow-100 px-2 rounded-md">
                Payment Status {order.paymentStatus}
              </span>
              <div>
                <hr className="border-t-2 border-black" />
              </div>
              <div className="flex justify-between text-black">
                <div></div>
                <button className="bg-black text-white px-7 rounded-md py-2 text-sm flex items-center justify-center">
                  Collect Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No order found.</p>
      )}
    </div>
  );
};

export default Order;
