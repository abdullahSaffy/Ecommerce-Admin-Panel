import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row, InputGroup, Dropdown } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import './AddProduct.css';

function AddProduct() {
  const [imagePreview, setImagePreview] = useState('');
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    manufacturer: '',
    sale: false,
    topRated: true,
    bestSelling: true,
    available: true,
    latestProduct: true,
    stock: '',
    categoryName: '',
    description: '',
    imagePath: '',
  });

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
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log('name: ', name);
    if (name === 'sale') {
      console.log('if called: ', typeof value);
      setNewProduct((prev) => {
        return { ...prev, sale: value === 'true' ? true : false };
      });
    } else {
      setNewProduct((prev) => {
        return { ...prev, [name]: value };
      });
    }
  };

  function handleImageChange(event) {
    let selectedFile = event.target.files[0];
    console.log('selectedFile', selectedFile);
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      console.log('ImagePreview', imagePreview);
      setNewProduct({ ...newProduct, imagePath: selectedFile });
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
    }
  }

  const addProduct = async (event) => {
    event.preventDefault();
    try {
      console.log('image: ', image);
      const data = new FormData();
      data.append('title', newProduct.title);
      data.append('price', newProduct.price);
      data.append('manufacturer', newProduct.manufacturer);
      data.append('sale', newProduct.sale);
      data.append('saleOnProduct', newProduct.saleOnProduct);
      data.append('topRated', newProduct.topRated);
      data.append('bestSelling', newProduct.bestSelling);
      data.append('available', newProduct.available);
      data.append('latestProduct', newProduct.latestProduct);
      data.append('stock', newProduct.stock);
      data.append('categoryName', newProduct.categoryName);
      data.append('description', newProduct.description);
      data.append('imagePath', image);
      // console.log('data', Object.fromEntries(data.entries()));
      axios
        .post('http://localhost:4000/api/createProduct', data)
        .then((response) => {
          console.log('new response: ', response);
          setImagePreview();
          setNewProduct({
            title: '',
            price: '',
            manufacturer: '',
            sale: false,
            saleOnProduct: '',
            topRated: true,
            bestSelling: true,
            available: true,
            latestProduct: true,
            stock: '',
            categoryName: '',
            description: '',
            imagePath: '',
          });
        });
    } catch (err) {
      console.log('Error : ' + err.message);
    }
  };

  console.log('product: ', newProduct);

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='add-product-content' lg={10}>
          <h4>Add Product</h4>
          <p>
            Please fill the product details in the form below to add a new
            product.
          </p>
          <Card className='add-product-form-card'>
            <Row>
              <Col>
                <div className='add-product-input-div'>
                  <p>Product Name</p>
                  <input
                    type='text'
                    name='title'
                    value={newProduct.title}
                    onChange={handleChange}
                  ></input>
                </div>
              </Col>
              <Col>
                <div className='add-product-input-div'>
                  <p>Product Price</p>
                  <input
                    type='text'
                    name='price'
                    value={newProduct.price}
                    onChange={handleChange}
                  ></input>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className='add-product-input-div'>
                  <p>Manufacturer</p>
                  <input
                    type='text'
                    name='manufacturer'
                    value={newProduct.manufacturer}
                    onChange={handleChange}
                  ></input>
                </div>
              </Col>
              <Col>
                <div className='add-product-input-div'>
                  <p>Sale</p>
                  <select
                    className='add-product-dropdown'
                    name='sale'
                    value={newProduct.sale}
                    onChange={handleChange}
                  >
                    <option>false</option>
                    <option>true</option>
                  </select>
                </div>
              </Col>
            </Row>

            {/* sale on Product */}
            {newProduct.sale && (
              <Row>
                <Col>
                  <div className='add-product-input-div'>
                    <p>Sale On Product</p>
                    <input
                      type='number'
                      name='saleOnProduct'
                      value={newProduct.saleOnProduct}
                      onChange={handleChange}
                    ></input>
                  </div>
                </Col>
              </Row>
            )}

            <Row>
              <Col>
                <div className='add-product-input-div'>
                  <p> Top Rated</p>
                  <select
                    className='add-product-dropdown'
                    name='topRated'
                    id='latestProd'
                    value={newProduct.topRated}
                    onChange={handleChange}
                  >
                    <option>false</option>
                    <option>true</option>
                  </select>
                </div>
              </Col>
              <Col>
                <div className='add-product-input-div'>
                  <p>Best Selling</p>
                  <select
                    className='add-product-dropdown'
                    name='bestSelling'
                    value={newProduct.bestSelling}
                    onChange={handleChange}
                  >
                    <option>false</option>
                    <option>true</option>
                  </select>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className='add-product-input-div'>
                  <p>Available</p>
                  <select
                    className='add-product-dropdown'
                    name='available'
                    value={newProduct.available}
                    onChange={handleChange}
                  >
                    <option>false</option>
                    <option>true</option>
                  </select>
                </div>
              </Col>
              <Col>
                <div className='add-product-input-div'>
                  <p>Latest Product</p>
                  <select
                    className='add-product-dropdown'
                    name='latestProduct'
                    value={newProduct.latestProduct}
                    onChange={handleChange}
                  >
                    <option>false</option>
                    <option>true</option>
                  </select>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className='add-product-input-div'>
                  <p> Category</p>
                  <select
                    className='add-product-dropdown'
                    name='categoryName'
                    value={newProduct.categoryName}
                    onChange={handleChange}
                  >
                    <option className='add-product-dropdown-option'>
                      Please select a product category
                    </option>
                    {categories.map((category, index) => {
                      return (
                        <option
                          className='add-product-dropdown-option'
                          key={index}
                        >
                          {category.title}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </Col>
              <Col>
                <div className='add-product-input-div'>
                  <p>Stock Quantity</p>
                  <input
                    type='number'
                    name='stock'
                    min={0}
                    value={newProduct.stock}
                    onChange={handleChange}
                  ></input>
                </div>
              </Col>
            </Row>

            <Row>
              <Col>
                <div className='add-product-input-div'>
                  <p>Product Description</p>
                  <textarea
                    rows={8}
                    name='description'
                    value={newProduct.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </Col>
              <Col>
                <div className='add-product-image-div'>
                  <div
                    onClick={() => {
                      imageButtonRef.current.click();
                    }}
                    className='product-image-div'
                  >
                    <Form.Control
                      ref={imageButtonRef}
                      style={{ display: 'none' }}
                      type='file'
                      name='imagePath'
                      accept='image/*'
                      onChange={handleImageChange}
                    />
                    {imagePreview ? (
                      <img src={imagePreview} alt='preview' />
                    ) : (
                      <p>Add product image</p>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <button onClick={addProduct} className='add-product-btn'>
              Add Product
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddProduct;



import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  CircularProgress,
} from '@mui/material';
import Product from './Product';
import {
  useProductListQuery,
  useGetProductByTopRatedQuery,
  useGetTopSellingProductQuery,
  useGetLatestProductQuery,
} from '../../store/api/productsApi';
import ReactLoading from 'react-loading';

const ProductsList = ({ product }) => {
  const [selectedArray, setSelectedArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('topRatedProd');

  const { data, isLoading } = useProductListQuery();
  const { data: topRatedProd } = useGetProductByTopRatedQuery();
  const { data: topSellingProd } = useGetTopSellingProductQuery();
  const { data: latestProd } = useGetLatestProductQuery();

  useEffect(() => {
    setSelectedArray(topRatedProd);
    console.log('topRatedProd: ', topRatedProd);
    if (data) {
      setLoading(false);
    }
  }, [data]);

  const handleOnClick = (array, tabName) => {
    // setLoading(true);
    setSelectedArray(array);
    setActiveTab(tabName);
    // setLoading(false);
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center'>
        {/* <CircularProgress /> */}
        <ReactLoading type='spokes' color='red' />
      </Box>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant='h4'
          display='flex'
          alignItems='center'
          gap='5px'
          sx={{
            fontSize: '30px',
            padding: '60px 0px 35px 0px',
            '&::before': {
              content: '""',
              display: 'block',
              backgroundColor: 'red',
              height: '40px',
              width: '3px',
            },
          }}
        >
          Our Products
        </Typography>

        <Box sx={{ display: 'flex' }}>
          <Typography
            sx={{
              paddingRight: '12px',
              cursor: 'pointer',
              ':hover': {
                color: 'black',
              },
              // '&.active': {
              //   color: 'blue',
              // },
              color: activeTab === 'topRatedProd' ? 'red' : 'black',
            }}
            onClick={() => handleOnClick(topRatedProd, 'topRatedProd')}
            // className={activeTab === topRatedProd ? 'active' : ''}
          >
            Top Rated
          </Typography>
          <Typography
            sx={{
              paddingRight: '12px',
              cursor: 'pointer',
              ':hover': {
                color: 'black',
              },
              // '&.active': {
              //   color: 'blue',
              // },
              color: activeTab === 'topSellingProd' ? 'red' : 'black',
            }}
            onClick={() => handleOnClick(topSellingProd, 'topSellingProd')}
            // className={activeTab === topSellingProd ? 'active' : ''}
          >
            Best Selling
          </Typography>
          <Typography
            sx={{
              cursor: 'pointer',
              ':hover': {
                color: 'black',
              },
              // '&.active': {
              //   color: 'blue',
              // },
              color: activeTab === 'latestProd' ? 'red' : 'black',
            }}
            onClick={() => handleOnClick(latestProd, 'latestProd')}
            // className={activeTab === latestProd ? 'active' : ''}
          >
            Latest Product
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {selectedArray?.data?.map((product, index) => (
          <Product
            style={{ textDecoration: 'none' }}
            product={product}
            key={index}
          />
        ))}
      </Grid>
    </Container>
  );
};

export default ProductsList;
