import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';

import {
  RiMailLine,
  RiPhoneLine,
  RiHome2Line,
  RiExternalLinkLine,
} from 'react-icons/ri';

import './Users.css';
import { CircularProgress } from '@material-ui/core';
import ReactLoading from 'react-loading';

import { Link } from 'react-router-dom';
import userImage from '../../Assets/khan.jpeg';
function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setUsers([]);
    setFilteredUsers([]);
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/userList',
    }).then((response) => {
      setFilteredUsers(response.data.data);
      setUsers(response.data.data);
      setLoading(false);
    });
  };

  const searchQueryChangeHandler = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setSearchQuery(value);
    console.log('value: ', value);

    if (value === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers([]);
      const query = value.toLowerCase();
      console.log('query: ', query);
      users.forEach((user) => {
        const name = user.name.toLowerCase();
        if (name.includes(query)) {
          setFilteredUsers((prev) => {
            return [...prev, user];
          });
        }
      });
    }
  };

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='users-content' lg={10}>
          <Row>
            <Col lg={8}>
              <h4>Users</h4>
              <p>
                Below are the customers that have registered on your website.
              </p>
            </Col>
            <Col className='users-search-col'>
              <div className='users-search-div'>
                <p>Search User</p>
                <input
                  type='text'
                  name='search'
                  value={searchQuery}
                  onChange={searchQueryChangeHandler}
                />
              </div>
            </Col>
          </Row>
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
            <Row className='users-row'>
              {filteredUsers.map((user, index) => {
                return (
                  <Col lg={3} key={index}>
                    <Card className='user-card'>
                      <img src={userImage} alt={user.name} />
                      <h5>{user.name}</h5>
                      <hr />
                      <p>
                        <a href={`tel:${user.phone}`}>
                          <RiPhoneLine className='user-card-icon' />
                        </a>
                        {user._id}
                      </p>
                      <p>
                        <a href={`mailto:${user.email}`}>
                          <RiMailLine className='user-card-icon' />
                        </a>
                        {user.email}
                      </p>
                      <p>
                        <RiHome2Line className='user-card-icon' />
                        Pakistan
                      </p>
                      <Link to={`/users/${user._id}`}>
                        <RiExternalLinkLine className='user-link' />
                      </Link>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Users;
