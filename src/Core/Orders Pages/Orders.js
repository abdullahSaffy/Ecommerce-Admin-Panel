import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import ReactLoading from 'react-loading';

import './Orders.css';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [pages, setPages] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOrders();
  }, []);

  const getOrders = () => {
    setOrders();
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/allShoppingCart',
    }).then((response) => {
      console.log('response', response.data.cart);
      setOrders(response.data.cart);
      setLoading(false);
    });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Order ID',
      width: 200,
      renderCell: (params) => {
        return <Link to={`/invoice/${params.row.id}`}>{params.row.id}</Link>;
      },
    },
    {
      field: 'userId',
      headerName: 'Customer ID',
      width: 200,
      renderCell: (params) => {
        // console.log('params: ', params);
        return (
          <Link to={`/users/${params.row.userId}`}>{params.row.userId}</Link>
        );
      },
    },
    {
      field: 'userName',
      headerName: 'Customer name',
      width: 240,
    },
    {
      field: 'userPhone',
      headerName: 'Customer Phone',
      width: 200,
    },
    {
      field: 'status',
      headerName: 'Order Status',
      width: 160,
    },
    {
      field: 'orderAmount',
      headerName: 'Order Amount',
      width: 160,
    },
    {
      field: 'orderedAt',
      headerName: 'Order Date',
      width: 160,
    },
  ];

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>

        <Col className='orders-content' lg={10}>
          <h4>Orders</h4>
          <p>Here is the list of all the orders placed on your website</p>
          <hr />
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
              {orders && (
                <div style={{ height: 600, width: '100%' }}>
                  <DataGrid
                    rows={orders.map((order) => {
                      return {
                        id: order._id,
                        userId: order.user,
                        userName: 'khan',
                        userPhone: 123456789,
                        status:
                          order.status == 'placed'
                            ? 'Placed'
                            : order.status == 'shipped'
                            ? 'Placed'
                            : order.status == 'delivered'
                            ? 'Placed'
                            : 'Placed',
                        orderAmount: `Rs. ${order.totalCost
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}$/-`,
                        orderedAt: order.createdAt,
                      };
                    })}
                    columns={columns}
                    pageSize={pages}
                    className='orders-data-grid'
                    rowsPerPageOptions={[5, 10, 15, 20, 25]}
                    onPageSizeChange={(pageSize) => {
                      setPages(pageSize);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Orders;
