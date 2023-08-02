import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import { Link } from 'react-router-dom';
import {
  RiMailLine,
  RiPhoneLine,
  RiHome2Line,
  RiShoppingCartLine,
} from 'react-icons/ri';
import userImage from '../../Assets/khan.jpeg';
import ReactLoading from 'react-loading';

import './User.css';

function User(props) {
  const [user, setUser] = useState();
  const userId = props.match.params.userId;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = () => {
    setUser();
    axios({
      method: 'get',
      url: `http://localhost:4000/api/user/${userId}`,
    }).then((response) => {
      console.log('response', response.data.data);
      setUser(response.data.data);
      setLoading(false);
    });
  };

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
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
            {user && (
              <Col className='user-content' lg={10}>
                <Card className='single-user-card'>
                  <Row>
                    <Col className='user-details-col'>
                      <img src={userImage} alt={user.name} />
                      <h4>{user.name}</h4>
                      <hr />
                      <p>
                        <RiHome2Line className='icon' /> Pakistan
                        {/* {user.address}, {user.city}
                    , {user.state} - {user.pin} */}
                      </p>
                      <p>
                        <RiPhoneLine className='icon' />
                        12345678
                        {/* {user.phone} */}
                      </p>
                      <p>
                        <RiMailLine className='icon' /> {user.email}
                      </p>
                      <p>
                        <RiShoppingCartLine className='icon' />{' '}
                        {/* {user.orders.length.toString()} */}
                        order(s) placed so far.
                      </p>
                    </Col>
                  </Row>
                </Card>
              </Col>
            )}
          </>
        )}
      </Row>
    </div>
  );
}

export default User;
