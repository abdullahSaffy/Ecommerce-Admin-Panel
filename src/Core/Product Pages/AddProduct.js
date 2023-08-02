import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row, InputGroup, Dropdown } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import './AddProduct.css';
import { Formik, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

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

  const validationSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    price: yup.string().required('Price is required'),
    manufacturer: yup.string().required('Manufacturer is required'),
    stock: yup.number().required('Stock quantity is required'),
    categoryName: yup.string().required('Category is required'),
    description: yup.string().required('Description is required'),
    imagePath: yup.mixed().required('Product image is required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    const data = new FormData();
    data.append('title', values.title);
    data.append('price', values.price);
    data.append('manufacturer', values.manufacturer);
    data.append('sale', values.sale);
    data.append('saleOnProduct', values.saleOnProduct);
    data.append('topRated', values.topRated);
    data.append('bestSelling', values.bestSelling);
    data.append('available', values.available);
    data.append('latestProduct', values.latestProduct);
    data.append('stock', values.stock);
    data.append('categoryName', values.categoryName);
    data.append('description', values.description);
    data.append('imagePath', values.imagePath);

    axios
      .post('http://localhost:4000/api/createProduct', data)
      .then((response) => {
        console.log('new response: ', response);
        setImagePreview('');
        resetForm();
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  // function handleImageChange(event, setFieldValue) {
  //   let selectedFile = event.target.files[0];
  //   console.log('selectedFile', selectedFile);
  //   if (selectedFile && types.includes(selectedFile.type)) {
  //     setImage(selectedFile);
  //     console.log('ImagePreview', imagePreview);
  //     setFieldValue('imagePath', selectedFile);
  //     setImagePreview(URL.createObjectURL(selectedFile));
  //   } else {
  //     setImage(null);
  //   }
  // }

  function handleImageChange(event) {
    let selectedFile = event.target.files[0];
    console.log('selectedFile', selectedFile);
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      console.log('ImagePreview', imagePreview);
      setNewProduct({ ...newProduct, imagePath: selectedFile });
      setImagePreview(URL.createObjectURL(selectedFile));
      // setFieldValue('imagePath', selectedFile); // Update the formik field value
    } else {
      setImage(null);
    }
  }

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='add-product-content' lg={10}>
          <h4>Add Product</h4>
          <p>
            Please fill in the product details in the form below to add a new
            product.
          </p>
          <Card className='add-product-form-card'>
            <Formik
              initialValues={{
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
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                handleSubmit,
                handleChange,
                values,
                setFieldValue,
                errors,
                touched,
              }) => (
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Product Name</p>
                        <Field
                          type='text'
                          name='title'
                          className='form-control'
                        />
                        <ErrorMessage
                          name='title'
                          component='div'
                          className='error-message'
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Product Price</p>
                        <Field
                          type='text'
                          name='price'
                          className='form-control'
                        />
                        <ErrorMessage
                          name='price'
                          component='div'
                          className='error-message'
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Manufacturer</p>
                        <Field
                          type='text'
                          name='manufacturer'
                          className='form-control'
                        />
                        <ErrorMessage
                          name='manufacturer'
                          component='div'
                          className='error-message'
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Sale</p>
                        <Field as='select' name='sale' className='form-control'>
                          <option value={false}>false</option>
                          <option value={true}>true</option>
                        </Field>
                      </div>
                    </Col>
                  </Row>

                  {values.sale && (
                    <Row>
                      <Col>
                        <div className='add-product-input-div'>
                          <p>Sale On Product</p>
                          <Field
                            type='number'
                            name='saleOnProduct'
                            className='form-control'
                          />
                          <ErrorMessage
                            name='saleOnProduct'
                            component='div'
                            className='error-message'
                          />
                        </div>
                      </Col>
                    </Row>
                  )}

                  <Row>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Top Rated</p>
                        <Field
                          as='select'
                          name='topRated'
                          className='form-control'
                        >
                          <option value={false}>false</option>
                          <option value={true}>true</option>
                        </Field>
                      </div>
                    </Col>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Best Selling</p>
                        <Field
                          as='select'
                          name='bestSelling'
                          className='form-control'
                        >
                          <option value={false}>false</option>
                          <option value={true}>true</option>
                        </Field>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Available</p>
                        <Field
                          as='select'
                          name='available'
                          className='form-control'
                        >
                          <option value={false}>false</option>
                          <option value={true}>true</option>
                        </Field>
                      </div>
                    </Col>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Latest Product</p>
                        <Field
                          as='select'
                          name='latestProduct'
                          className='form-control'
                        >
                          <option value={false}>false</option>
                          <option value={true}>true</option>
                        </Field>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Category</p>
                        <Field
                          as='select'
                          name='categoryName'
                          className='form-control'
                        >
                          <option value='' disabled>
                            Please select a product category
                          </option>
                          {categories.map((category, index) => (
                            <option value={category.title} key={index}>
                              {category.title}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name='categoryName'
                          component='div'
                          className='error-message'
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Stock Quantity</p>
                        <Field
                          type='number'
                          name='stock'
                          className='form-control'
                          min={0}
                        />
                        <ErrorMessage
                          name='stock'
                          component='div'
                          className='error-message'
                        />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <div className='add-product-input-div'>
                        <p>Product Description</p>
                        <Field
                          as='textarea'
                          rows={8}
                          name='description'
                          className='form-control'
                        />
                        <ErrorMessage
                          name='description'
                          component='div'
                          className='error-message'
                        />
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
                            onChange={(event) => {
                              setFieldValue(
                                'imagePath',
                                event.currentTarget.files[0]
                              );
                              handleImageChange(event);
                            }}
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

                  <button type='submit' className='add-product-btn'>
                    Add Product
                  </button>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddProduct;
