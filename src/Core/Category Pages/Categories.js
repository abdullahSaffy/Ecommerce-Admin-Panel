import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import { RiAddFill, RiEditLine, RiEyeLine } from 'react-icons/ri';
import image from '../../Assets/khan.jpeg';
import './Categories.css';
import ReactLoading from 'react-loading';

import { Link } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    setCategories([]);
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/allCategories',
    }).then(function (response) {
      console.log('response: ', response.data.data);
      setCategories(response.data.data);
      setLoading(false);
    });
  };

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>

        <Col className='categories-content' lg={10}>
          <Row>
            <Col lg={10}>
              <h4>Product Categories</h4>
              <p>Below are the product categories currently added.</p>
            </Col>
            <Col className='add-cat-col' lg={2}>
              <OverlayTrigger
                placement='top'
                overlay={
                  <Tooltip>
                    <div className='add-cat-overlay'>Add new category.</div>
                  </Tooltip>
                }
              >
                <Link to='/categories/add'>
                  <div>
                    <RiAddFill className='add-cat-btn' />
                  </div>
                </Link>
              </OverlayTrigger>
            </Col>
          </Row>
          <hr />
          <Row className='categories-row'>
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
              categories.map((category, index) => {
                {
                  /* const base64String = btoa(
                  String.fromCharCode(
                    ...new Uint8Array(category?.imagePath?.data?.data)
                  )
                ); */
                }

                const base64String = btoa(
                  new Uint8Array(category?.imagePath?.data?.data)
                    .reduce(
                      (data, byte) => (
                        data.push(String.fromCharCode(byte)), data
                      ),
                      []
                    )
                    .join('')
                );
                return (
                  <Col lg={3} key={index}>
                    <Card className='category-card'>
                      <img
                        src={
                          base64String
                            ? `data:image/png;base64,${base64String}`
                            : image
                        }
                      />
                      <h5>{category.title}</h5>
                      <Link to={`/categories/edit/${category._id}`}>
                        <RiEditLine className='edit-cat-btn' />
                      </Link>
                      <Link to={`/categories/products/${category._id}`}>
                        <RiEyeLine className='view-prod-btn' />
                      </Link>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Categories;
