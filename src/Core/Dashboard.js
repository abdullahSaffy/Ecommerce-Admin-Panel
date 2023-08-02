import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../Components/Sidebar';
import {
  RiShoppingCart2Line,
  RiUser3Line,
  RiFeedbackLine,
} from 'react-icons/ri';
import { IoIosLaptop } from 'react-icons/io';
import { FaDollarSign } from 'react-icons/fa';
import { BsViewList } from 'react-icons/bs';
import { FaLaptopMedical } from 'react-icons/fa';
import ReactLoading from 'react-loading';

import './Dashboard.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [orders, setOrders] = useState();
  const [totalRevenue, setTotalRevenue] = useState();
  const [products, setProducts] = useState();
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders();
    getUsers();
    getProducts();
  }, []);

  const getProducts = () => {
    setProducts();
    setLoading(true);
    axios
      .get('http://localhost:4000/api/productsList')
      .then((response) => {
        setProducts(response?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getUsers = () => {
    setUsers();
    setLoading(true);
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/userList',
    })
      .then((response) => {
        setUsers(response?.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getOrders = () => {
    setOrders();
    setLoading(true);
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/allShoppingCart',
    }).then((response) => {
      console.log('response: ', response);
      setOrders(response?.data?.cart);
      let rev = 0;
      response.data.cart.forEach((order) => {
        rev += order.totalCost;
      });
      setTotalRevenue(rev);
      setLoading(false);
    });
  };

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='dashboard-home-content' lg={10}>
          <h4>Dashboard</h4>
          <p>Here's an overview of your online business.</p>
          <Row>
            <Col>
              {loading ? (
                <ReactLoading
                  type='spokes'
                  color='#2D46B9'
                  height={50}
                  width={50}
                />
              ) : (
                orders && (
                  <Card className='dashboard-card'>
                    <RiShoppingCart2Line className='card-icon' />
                    <h4>{orders.length} Orders</h4>
                    <p>{orders.length} orders placed</p>
                  </Card>
                )
              )}
            </Col>
            <Col>
              {loading ? (
                <ReactLoading
                  type='spokes'
                  color='#2D46B9'
                  height={50}
                  width={50}
                />
              ) : (
                totalRevenue && (
                  <Card className='dashboard-card'>
                    <FaDollarSign className='card-icon' />
                    <h4>
                      {totalRevenue
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      Total Revenue
                    </h4>
                    <p>
                      {totalRevenue
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      revenue generated
                    </p>
                  </Card>
                )
              )}
            </Col>
            <Col>
              {loading ? (
                <ReactLoading
                  type='spokes'
                  color='#2D46B9'
                  height={50}
                  width={50}
                />
              ) : (
                products && (
                  <Card className='dashboard-card'>
                    <IoIosLaptop className='card-icon' />
                    <h4>{products.total} Products</h4>
                    <p>{products.total} products added</p>
                  </Card>
                )
              )}
            </Col>
            <Col>
              {loading ? (
                <ReactLoading
                  type='spokes'
                  color='#2D46B9'
                  height={50}
                  width={50}
                />
              ) : (
                users && (
                  <Card className='dashboard-card'>
                    <RiUser3Line className='card-icon' />
                    <h4>{users.data.length} Customers</h4>
                    <p>{users.data.length} registered customers</p>
                  </Card>
                )
              )}
            </Col>
          </Row>

          <h4>Quick Links</h4>
          <Row>
            <Col>
              <Card className='dashboard-action-card'>
                <BsViewList className='action-icon' />
                <h4>Product Categories</h4>
                <p>
                  <Link to='/categories'>Click here</Link> to add, remove or
                  edit categories
                </p>
              </Card>
            </Col>
            <Col>
              <Card className='dashboard-action-card'>
                <IoIosLaptop className='action-icon' />
                <h4>All products</h4>
                <p>
                  <Link to='/products'>Click here</Link> to view, remove or edit
                  products
                </p>
              </Card>
            </Col>
            <Col>
              <Card className='dashboard-action-card'>
                <FaLaptopMedical className='action-icon' />
                <h4>Add Products</h4>
                <p>
                  <Link to='/products/add'>Click here</Link> to add new products
                </p>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <Card className='dashboard-action-card'>
                <RiShoppingCart2Line className='action-icon' />
                <h4>All Orders</h4>
                <p>
                  <Link to='/orders'>Click here</Link> to view, remove or edit
                  orders
                </p>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className='dashboard-action-card'>
                <RiUser3Line className='action-icon' />
                <h4>All Customers</h4>
                <p>
                  <Link to='/users'>Click here</Link> to view registered
                  customer details
                </p>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
