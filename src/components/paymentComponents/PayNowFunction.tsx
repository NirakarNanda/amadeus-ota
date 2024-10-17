"use client";
import axios from "axios";
import React from "react";

type Props = {};

const PayNowFunction = (props: Props) => {
  const handlePayNowClick = async () => {
    console.log(">>>>>>>>>>>>>>>>>>>");

    try {
      const response = await axios.post(
        "http://localhost:8010/payment/checkout",
        { amount: 20 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response, ">>>>>>>>>>>>>>>>>>>.");

      var options = {
        key: "rzp_test_mBBfOCZrMx5wNc", // Enter the Key ID generated from the Dashboard
        amount: response.data.data.order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Tripswift", // your business name
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: response.data.data.order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response: any) {
          console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>start>>>>>>.');
          verifyPayment(response);
        },
        prefill: {
          // We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: "Gaurav Kumar", // your customer's name
          email: "gaurav.kumar@example.com",
          contact: "9437948060", // Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };

      // @ts-ignore
      var rzp1 = new Razorpay(options);
      rzp1.open();

      rzp1.on("payment.failed", function (response: any) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
    } catch (error) {
      console.error("An error occurred during payment processing:", error);
    }
  };

  async function verifyPayment(response: any) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>start2>>>>>>.');

    try {
      const verify = await axios.post(
        "http://localhost:8010/payment/verify",
        {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(verify, ">>>>>>>>>>>>>>>>>>>>>>>>>>.");
    } catch (error) {
      console.error("An error occurred during payment verification:", error);
    }
  }

  return (
    <div className="flex justify-center items-center mt-2">
      <button className="bg-red-600 text-white p-4" onClick={handlePayNowClick}>
        Pay Now
      </button>
    </div>
  );
};

export default PayNowFunction;
