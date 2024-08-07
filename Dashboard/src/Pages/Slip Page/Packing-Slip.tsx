import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Order as OrderType } from "../../Types/OrderTypes";
import { specificOrder } from "../../Services/api";
import { format } from "date-fns";
import { useReactToPrint } from "react-to-print";

const PackingSlip = () => {
  const [order, setOrder] = useState<OrderType | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldPrint = searchParams.get("print") === "true";
  const componentRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (shouldPrint && !loading && !error && order) {
      handlePrint();
    }
  }, [shouldPrint, loading, error, order]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>No order found.</p>;
  }

  const totalAmount = order.items.reduce(
    (sum, item) => sum + item.product.productPrice * item.quantity,
    0
  );

  return (
    <div ref={componentRef} className="p-8 min-h-screen">
      <div className="max-w-4xl mx-auto bg-gray-100">
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/Zylo Logo.png" alt="Logo" className="w-12" />
          </div>
          <div>
            <p className="text-xs">Date</p>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs">
              {format(new Date(order.createdAt), "MMMM dd, yyyy HH:mm")}
            </span>
          </div>
        </div>
        <hr className="border-t border-gray-300 my-2 mx-5" />
        <div className="p-6 space-y-2">
          <div>
            <p className="text-sm">Shipping to:</p>
            <div className="space-y-1 text-xs p-1 text-gray-800">
              <p>{order.name}</p>
              <p>{order.email}</p>
              <p>{order.phoneNumber}</p>
              <p>{order.address}</p>
            </div>
            <hr className="border-t border-gray-300 my-4" />
          </div>
          <div className="p-4 rounded-md">
            <h2 className="text-md font-medium mb-4">Items</h2>
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.productName}
                  className="w-12 h-12 rounded-md"
                />
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-medium">
                    {item.product.productName}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    ${item.product.productPrice.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <div className="font-medium text-sm">
                  ${(item.product.productPrice * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <hr className="border-t border-gray-300 my-4" />
          </div>
          <div className="p-4 rounded-md">
            <div className="text-gray-700 space-y-2">
              <div className="flex justify-between text-sm">
                <p>Subtotal ({order.items.length} items)</p>
                <p>${totalAmount.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping ({order.shippingMethod})</p>
                <p>${order.shippingMethod === "rush" ? "15.00" : "5.00"}</p>
              </div>
              <div className="flex justify-between font-semibold text-sm">
                <p>Total</p>
                <p>${order.total.toFixed(2)}</p>
              </div>
            </div>
            <hr className="border-t border-gray-300 my-4" />
          </div>
          <div className="flex flex-col justify-center items-center text-sm">
            <p>Zylo</p>
            <p>Thanks for choosing our products</p>
            <p>For any assistance, feel free to contact our support team.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackingSlip;
