import {v4 as uuid} from 'uuid';

export const makePayment  = async ( price, Razorpay, fun  ) => {
  console.log(price);
  
    price = parseInt(price, 10);
  const options = {
    key: "rzp_test_dCc7zFPTy5AGCv",
    // order_id: uuid(),
    currency: "INR",
    amount: price,
    name: "Learning To Code Online",
    description: "Test Wallet Transaction",
    image: "http://localhost:1337/logo.png",
    handler:  (response) => {
      
      if(response.razorpay_payment_id){
        fun();
      }
    },
    prefill: {
      name: "Anirudh Jwala",
      email: "anirudh@gmail.com",
      contact: "9999999999",
    },
  };


 

const rzp1 = new Razorpay(options);

  rzp1.on("payment.failed",  (response) => {
   console.log(response);
    // alert(response.error.code);
    // alert(response.error.description);
    // alert(response.error.source);
    // alert(response.error.step);
    // alert(response.error.reason);
    // alert(response.error.metadata.order_id);
    // alert(response.error.metadata.payment_id);
  });

  rzp1.open();

}