import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import {
  RiMailLine,
  RiPhoneLine,
  RiHome2Line,
  RiUser3Line,
  RiUserLocationLine,
  RiCalendarEventLine,
  RiCalendarTodoLine,
  RiCalendarCheckLine,
  RiMoneyDollarCircleLine,
  RiQuestionLine,
} from 'react-icons/ri';

import './Order.css';
import { useHistory } from 'react-router';
import userImage from '../../Assets/khan.jpeg';
import ReactLoading from 'react-loading';

function Order(props) {
  const [order, setOrder] = useState({});
  const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const history = useHistory();
  const orderId = props.match.params.orderId;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getOrder();
  }, []);

  console.log('orders: ', order);
  const getOrder = () => {
    axios({
      method: 'get',
      url: `http://localhost:4000/api/orderCart/${orderId}`,
    }).then((response) => {
      console.log(response.data.cart);
      setOrder(response.data.cart);
      setLoading(false);
    });
  };

  const updateOrderStatus = (event, status, shippedAt, deliveredAt) => {
    event.preventDefault();
    axios({
      method: 'patch',
      url: `https://ecommerceappcj.herokuapp.com/api/orders/${orderId}`,
      data: {
        status: status,
        shippedAt: shippedAt,
        deliveredAt: deliveredAt,
      },
    }).then((res) => {
      history.push('/orders');
    });
  };

  const deleteOrder = (event) => {
    event.preventDefault();
    axios({
      method: 'delete',
      url: `https://ecommerceappcj.herokuapp.com/api/orders/${orderId}`,
    }).then(() => {
      history.push('/orders');
    });
  };

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='single-order-content' lg={10}>
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                minHeight: '200px',
              }}
            >
              <ReactLoading type='spokes' color='#2D46B9' />
            </div>
          ) : (
            <>
              {order && order.user && (
                <Card className='order-card'>
                  <Row className='order-user-details'>
                    <Col lg={3}>
                      <img src={userImage} alt={order.user} />
                    </Col>
                    <Col>
                      <Row>
                        <Col className='user-detail-col'>
                          <p>
                            <RiUser3Line className='user-icon' />{' '}
                            {/* {order.userId.name} */}
                            khan
                          </p>
                          <p>
                            <RiPhoneLine className='user-icon' />{' '}
                            {/* {order.userId.phone} */}
                            123456789
                          </p>
                          <p>
                            <RiMailLine className='user-icon' />{' '}
                            {/* {order.userId.email} */}
                            khansaffy1@gmail.com
                          </p>
                          <p>
                            <RiHome2Line className='user-icon' />{' '}
                            {/* {order.userId.address}, {order.userId.city} -{' '}
                        {order.userId.pin} */}
                          </p>
                          <p>
                            <RiUserLocationLine className='user-icon' />{' '}
                            {/* {order.userId.state} */}
                          </p>
                        </Col>
                        <Col className='order-detail-col'>
                          <p>
                            <RiQuestionLine className='order-icon' />{' '}
                            {order.status == 'placed'
                              ? 'Placed'
                              : order.status == 'shipped'
                              ? 'Shipped'
                              : order.status == 'delivered'
                              ? 'Delivered'
                              : 'Cancelled'}
                          </p>
                          <p>
                            <RiMoneyDollarCircleLine className='order-icon' />{' '}
                            {`Rs. ${order.totalCost
                              .toString()
                              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}/-`}
                          </p>
                          <p>
                            <RiCalendarEventLine className='order-icon' />
                            {/* {order.orderedAt} */}friday
                          </p>
                          <p>
                            <RiCalendarTodoLine className='order-icon' />
                            {/* {order.shippedAt} */}
                            12
                          </p>
                          <p>
                            <RiCalendarCheckLine className='order-icon' /> 16
                            {/* {order.deliveredAt} */}
                          </p>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className='order-actions'>
                    <Col>
                      <button
                        onClick={(e) => {
                          let date = new Date();
                          const day = weekday[date.getDay()];
                          updateOrderStatus(
                            e,
                            'shipped',
                            `${day}, ${date.getDate()} ${
                              month[date.getMonth()]
                            } ${date.getFullYear()}`,
                            'Not yet delivered'
                          );
                        }}
                      >
                        Order Shipped
                      </button>
                    </Col>
                    <Col>
                      <button
                        onClick={(e) => {
                          let date = new Date();
                          const day = weekday[date.getDay()];
                          updateOrderStatus(
                            e,
                            'delivered',
                            order.shippedAt,
                            `${day}, ${date.getDate()} ${
                              month[date.getMonth()]
                            } ${date.getFullYear()}`
                          );
                        }}
                      >
                        Order Delivered
                      </button>
                    </Col>
                    <Col>
                      <button
                        onClick={(e) => {
                          updateOrderStatus(
                            e,
                            'cancelled',
                            order.shippedAt,
                            order.deliveredAt
                          );
                        }}
                      >
                        Order Cancelled
                      </button>
                    </Col>
                    <Col>
                      <button onClick={deleteOrder}>Delete Order</button>
                    </Col>
                  </Row>
                  <div className='order-products-div'>
                    {order.products &&
                      order.products.map((item, index) => {
                        return (
                          <Card className='order-product-card' key={index}>
                            <Row className='product-card-row'>
                              <Col className='product-image-col'>
                                <img
                                  src={`https://ecommerceappcj.herokuapp.com/${item.productId.image}`}
                                  alt={item.productId.name}
                                />
                              </Col>
                              <Col className='product-order-details' lg={10}>
                                <Row>
                                  <Col>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Product ID :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>{item.productId.id}</strong>
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Name :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>{item.productId.name}</strong>
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Price :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>
                                            Rs.{' '}
                                            {item.productId.price
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                              )}
                                            /-
                                          </strong>
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Category ID :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>
                                            {item.productId.category}
                                          </strong>
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Quantity :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>{item.quantity}</strong>
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Item Total :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>
                                            Rs.&nbsp;
                                            {item.total
                                              .toString()
                                              .replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                              )}
                                            /-
                                          </strong>
                                        </p>
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={2}>
                                        <p>Description :</p>
                                      </Col>
                                      <Col>
                                        <p>
                                          <strong>
                                            {item.productId.description}
                                          </strong>
                                        </p>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Card>
                        );
                      })}
                  </div>
                </Card>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Order;
