import React from 'react';
import useAsync from '@hooks/useAsync';
import CategoryServices from '@services/CategoryServices';

export default function PaymentsTable({ _id }) {
  const userId = _id;

  const { data: paymentData, loading, error } = useAsync(
    () => userId && CategoryServices.getPayments(userId),
    [userId]
  );


  function formatDateTime(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "short" }); // e.g. Nov
    const year = date.getFullYear();
    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // e.g. 10:30 AM
    return `${day} ${month} ${year}, ${time}`;
  }

  if (loading) return <div>Loading payments...</div>;
  if (error) return <div>Error: {error.message || error}</div>;
  if (!paymentData || (paymentData.payments && paymentData.payments.length === 0)) {
    return <div>No order found</div>;
  }

  return (
    <div>
      {/* <h3>Payment Details for User: {userId}</h3> */}

      <div className='mobilePaymentTable overflow-x-auto'>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Email</th>
            <th>Paid For</th>
            <th>Payment Date & Time</th>
            <th>Payment Status</th>
            <th>Amount (INR)</th>
          </tr>
        </thead>
        <tbody>
          {paymentData.payments.map((payment) => (
            <tr key={payment._id}>
              <td>{payment.order_id}</td>
              <td>{payment.billing_email}</td>
              <td>{payment.paidFor}</td>
              <td>{formatDateTime(payment.payment_date)}</td>
              <td>{payment.order_status}</td>
              <td>{payment.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* <h4>Total Amount: INR {paymentData.total_amount}</h4> */}
    </div>
  );
}
