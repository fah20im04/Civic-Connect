import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import LoadingPage from "../LoadingPage";
import Swal from "sweetalert2";

const PatmentLogs = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch payment logs (admin only)
  const {
    data: payments = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments");
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Payment Logs</h2>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="table w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Transaction ID</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((payment, index) => (
              <tr key={payment._id}>
                <td>{index + 1}</td>

                <td>{payment.userName || "N/A"}</td>

                <td>{payment.email}</td>

                <td className="font-semibold">
                  {payment.amount} tk
                </td>

                <td>
                  <span className="badge badge-outline">
                    {payment.method || "Online"}
                  </span>
                </td>

                <td className="text-sm">
                  {payment.transactionId}
                </td>

                <td>
                  {payment.paymentStatus === "paid" ? (
                    <span className="badge badge-success">Success</span>
                  ) : (
                    <span className="badge badge-error">Failed</span>
                  )}
                </td>

                <td className="text-sm">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-center p-6 text-gray-500">
            No payment records found.
          </p>
        )}
      </div>
    </div>
  );
};

export default PatmentLogs;
