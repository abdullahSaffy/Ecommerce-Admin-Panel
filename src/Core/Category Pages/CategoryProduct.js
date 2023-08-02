import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import { RiDeleteBin3Line, RiEditLine } from 'react-icons/ri';
import './CategoryProduct.css';
import { Link } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';

function CategoryProduct(props) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const category = props.match.params.categoryId;

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = () => {
    console.log('getProducts: ', category);
    setProducts([]);
    axios({
      method: 'get',
      url: `http://localhost:4000/api/productsListByCategory/${category}`,
    }).then((response) => {
      console.log('response: ', response.data.data);
      setLoading(false);
      setProducts(response?.data?.data);
      setFilteredProducts(response?.data?.data);
    });
  };

  const deleteProduct = (productId) => {
    axios({
      method: 'delete',
      url: `http://localhost:4000/api/product/delete/${productId}`,
    }).then((response) => {
      console.log(response.data);
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
        <Col className='category-products-content' lg={10}>
          <Row>
            <Col lg={8}>
              <h4>Products</h4>
              <p>Below are the products currently added to your website.</p>
            </Col>
            <Col className='category-product-search-col'>
              <div className='category-product-search-div'>
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
          <Row className='category-products-row'>
            {loading ? (
              <CircularProgress />
            ) : (
              filteredProducts.map((product, index) => {
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
                {
                  /* const base64String = btoa(
                  String.fromCharCode(
                    ...new Uint8Array(product?.imagePath?.data?.data)
                  )
                ); */
                }

                const commaCost = product.price
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                return (
                  <Col lg={3} key={index}>
                    <Card className='category-product-card'>
                      <img
                        src={
                          base64String
                            ? `data:image/png;base64,${base64String}`
                            : product.imagePath
                        }
                        alt={product.name}
                      />
                      <h5>{product.title}</h5>
                      {/* <p>Cost : Rs. {commaCost}/-</p> */}
                      <Link to={`/products/edit/${product._id}`}>
                        <RiEditLine className='category-product-card-icon category-edit-icon' />
                      </Link>
                      <RiDeleteBin3Line
                        onClick={(event) => {
                          event.preventDefault();
                          deleteProduct(product._id);
                        }}
                        className='category-product-card-icon category-delete-icon'
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

export default CategoryProduct;
