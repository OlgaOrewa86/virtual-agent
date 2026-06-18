import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`http://localhost:3001/api/orders/${orderId}`);
        const data = await res.json();

        if (data.error) {
          setError("Order not found");
        } else {
          setOrder(data);
        }
      } catch (err) {
        setError("Failed to load order");
      }

      setLoading(false);
    }

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading order details…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

    // Fake creation date: 1 day ago
  const createdAt = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Format date nicely
  const createdDateString = createdAt.toLocaleDateString("en-NZ", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Calculate "X days ago"
  const daysAgo = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));


  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Order #{orderId}
      </h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">

        {/* Status section */}
        <div>
          <p className="text-gray-700 font-medium mb-1">Current status</p>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Shipped"
                ? "bg-blue-100 text-blue-700"
                : order.status === "Out for delivery"
                ? "bg-purple-100 text-purple-700"
                : order.status === "Processing"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <p className="text-gray-700 font-medium mb-2">Progress</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{
                width:
                  order.status === "Processing"
                    ? "25%"
                    : order.status === "Shipped"
                    ? "50%"
                    : order.status === "Out for delivery"
                    ? "75%"
                    : order.status === "Delivered"
                    ? "100%"
                    : "10%"
              }}
            ></div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-gray-700 font-medium mb-3">Tracking history</p>

          <div className="border-l-2 border-gray-300 pl-4 space-y-6">

            {/* Status event */}
            <div>
              <p className="text-gray-900 font-semibold">{order.status}</p>
              <p className="text-gray-500 text-sm">Updated just now</p>
            </div>

            {/* Created event */}
            <div>
              <p className="text-gray-900 font-semibold">Order created</p>
              <p className="text-gray-500 text-sm">
                {createdDateString} ({daysAgo} day{daysAgo !== 1 ? "s" : ""} ago)
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );


}
