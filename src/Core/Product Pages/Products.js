import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { RiDeleteBin3Line, RiEditLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';
import Loader from '../Components/Loader';
import ReactLoading from 'react-loading';

import './Products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    setProducts([]);
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/productsList',
    }).then((response) => {
      setProducts(response.data.data);
      setLoading(false);
      setFilteredProducts(response.data.data);
    });
  };

  const deleteProduct = (productId) => {
    axios({
      method: 'delete',
      url: `http://localhost:4000/api/product/delete/${productId}`,
    }).then((response) => {
      console.log(response);
      getProducts();
    });
  };

  const searchQueryChangeHandler = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setSearchQuery(value);

    if (value === '') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts([]);
      const query = value.toLowerCase();
      const length = query.length;

      products.forEach((product) => {
        const name = product.name.toLowerCase();
        const substring = name.substring(0, length);

        let res = substring.localeCompare(query);
        if (name.includes(query)) {
          setFilteredProducts((prev) => {
            return [...prev, product];
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
        <Col className='products-content' lg={10}>
          <Row>
            <Col lg={8}>
              <h4>Products</h4>
              <p>Below are the products currently added to your website.</p>
            </Col>
            <Col className='product-search-col'>
              <div className='product-search-div'>
                <p>Search Product</p>
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
          <Row className='products-row'>
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
              filteredProducts.map((product, index) => {
                console.log(
                  'product?.imagePath?.data?.data; ',
                  product?.imagePath?.data?.data
                );

                const base64String = btoa(
                  new Uint8Array(product?.imagePath?.data?.data)
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
                    <Card className='product-card'>
                      <img
                        src={
                          base64String
                            ? `data:image/png;base64,${base64String}`
                            : product.imagePath
                        }
                        alt={product.imagePath}
                      />
                      <h5>{product.title}</h5>
                      <p>Cost : Rs. {product.price}/-</p>

                      <Link to={`/products/edit/${product._id}`}>
                        <RiEditLine className='product-card-icon edit-icon' />
                      </Link>
                      <RiDeleteBin3Line
                        onClick={(event) => {
                          event.preventDefault();
                          deleteProduct(product._id);
                        }}
                        className='product-card-icon delete-icon'
                      />
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

export default Products;
