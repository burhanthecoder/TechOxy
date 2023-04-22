import React from 'react';
import './Orders.css';
import moment from 'moment';
import CurrencyFormat from 'react-currency-format';
import CheckoutProduct from '../components/CheckoutProduct';

function Order({ order }) {
  const newOrder = [
    {
      id: '5000',
      title: 'item.title',
      image:
        'https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX325_BO1,204,203,200_.jpg',
      price: 500,
      rating: 4,
      amount: 1500
    },
    {
      id: '5000',
      title: 'item.title',
      image:
        'https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX325_BO1,204,203,200_.jpg',
      price: 500,
      rating: 4,
      amount: 1500
    },
    {
      id: '5000',
      title: 'item.title',
      image:
        'https://images-na.ssl-images-amazon.com/images/I/51Zymoq7UnL._SX325_BO1,204,203,200_.jpg',
      price: 500,
      rating: 4
    }
  ];
  return (
    <div className="orders">
      <h2>Your Orders</h2>
      <div className="orders__order">
        {/* <p>{moment.unix(order.data.created).format("MMMM Do YYYY, h:mma")}</p> */}
        <p>{moment.unix(Date.now()).format('MMMM Do YYYY, h:mma')}</p>
        <p className="order__id">
          {/* <small>{order.id}</small> */}
          {/* <small>1234123</small> */}
        </p>
        {newOrder.map((item) => (
          <div
            style={{
              border: '1px solid black',
              padding: '2px',
              margin: '2px'
            }}
          >
            <CheckoutProduct
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rating}
              hideButton
            />
          </div>
        ))}
        <CurrencyFormat
          renderText={(value) => <h3 className="order__total">Order Total: {value}</h3>}
          decimalScale={2}
          // value={order.data.amount / 100}
          value={5000 / 100}
          displayType="text"
          // thousandSeparator={true}
          prefix="$"
        />
      </div>
    </div>
  );
}

export default Order;
