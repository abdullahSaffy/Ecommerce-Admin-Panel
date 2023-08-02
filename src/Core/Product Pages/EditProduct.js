import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';

import './EditProduct.css';
import { useHistory } from 'react-router';

function EditProduct(props) {
  const [productData, setProductData] = useState();
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const productId = props.match.params.productId;
  const history = useHistory();

  useEffect(() => {
    getCategories();
    getProduct();
  }, []);

  const getProduct = () => {
    setProductData();
    axios({
      method: 'get',
      url: `http://localhost:4000/api/product/${productId}`,
    })
      .then((response) => {
        console.log('res', response.data.data);
        setProductData(response.data.data);
      })
      .catch((err) => {
        console.log('Error : ' + err.message);
      });
  };

  const getCategories = () => {
    setCategories([]);
    axios({
      method: 'get',
      url: 'http://localhost:4000/api/allCategories',
    }).then(function (response) {
      console.log('response', response);
      setCategories(response.data.data);
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProductData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  function handleImageChange(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      setProductData({ ...productData, image: selectedFile });
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
    }
  }

  const editProduct = async (event) => {
    event.preventDefault();

    const updatedData = new FormData();
    updatedData.append('title', productData.title);
    updatedData.append('price', productData.price);
    updatedData.append('categoryName', productData.categoryName);
    updatedData.append('stock', productData.stock);
    updatedData.append('description', productData.description);
    // updatedData.append('imagePath', image);
    if (image) {
      console.log('imagePath', image);
      updatedData.append('imagePath', image);
    } else {
      console.log('productData.imagePath: ', productData.imagePath);
      updatedData.append('isOldImage', true);
    }
    try {
      await axios
        .put(
          `http://localhost:4000/api/product/update/${productId}`,
          updatedData
        )
        .then((response) => {
          console.log('edit data', response);
          setImagePreview();
          setProductData({
            title: '',
            price: '',
            categoryName: '',
            stock: '',
            description: '',
            imagePath: '',
          });
          history.push('/products');
        })
        .catch((err) => {
          console.log('err: ', err);
        });
    } catch (err) {
      console.log('Error: ' + err.message);
    }

    // try {
    //   axios
    //     .put(
    //       `http://localhost:4000/api/product/update/${productId}`,
    //       {
    //         title: productData.title,
    //         price: productData.price,
    //         categoryName: productData.categoryName,
    //         stock: productData.stock,
    //         description: productData.description,
    //         imagePath: image,
    //       },
    //       {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       }
    //     )
    //     .then((response) => {
    //       console.log('response: ', response);
    //       setProductData({
    //         title: '',
    //         price: '',
    //         categoryName: '',
    //         stock: '',
    //         description: '',
    //         imagePath: '',
    //       });
    //       history.push('/products');
    //       console.log('edit data', response);
    //     });
    // } catch (err) {
    //   console.log('Error : ' + err.message);
    // }
  };

  console.log('productData: ', productData);

  // const base64String = btoa(
  //   String.fromCharCode(...new Uint8Array(productData?.imagePath?.data?.data))
  // );

  const base64String = btoa(
    new Uint8Array(productData?.imagePath?.data?.data)
      .reduce((data, byte) => (data.push(String.fromCharCode(byte)), data), [])
      .join('')
  );
  console.log('imagePrev: ', imagePreview);
  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='add-product-content' lg={10}>
          <h4>Update Product</h4>
          {productData && (
            <p>
              Please fill the product details in the form below to update{' '}
              <strong>{productData.name}</strong>.
            </p>
          )}
          <Card className='add-product-form-card'>
            {productData && (
              <div>
                <Row>
                  <Col>
                    <div className='add-product-input-div'>
                      <p>Product Name</p>
                      <input
                        type='text'
                        name='title'
                        value={productData.title}
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
                        value={productData.price}
                        onChange={handleChange}
                      ></input>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className='add-product-input-div'>
                      <p>Product Category</p>
                      <select
                        className='add-product-dropdown'
                        name='categoryName'
                        value={productData.categoryName}
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
                        value={productData.stock}
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
                        value={productData.description}
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
                        {/* {imagePreview ? (
                          <img src={productData.image} alt='preview' />
                        ) : (
                          <img src={`data:image/png;base64,${base64String}`} />
                          {/*src={`data:${productData?.imagePath?.contentType};base64,${base64String}`}
                          */}
                        {/* )}  */}
                        {imagePreview ? (
                          <img src={imagePreview} alt='preview 1' />
                        ) : productData.imagePath &&
                          productData.imagePath.data ? (
                          <img
                            src={`data:${productData?.imagePath?.contentType};base64,${base64String}`}
                            alt='preview 2'
                          />
                        ) : productData.imagePath ? (
                          <img src={productData.imagePath} alt='preview 3' />
                        ) : (
                          <img src={productData.imagePath} alt='preview 4' />
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
                <button onClick={editProduct} className='add-product-btn'>
                  Update Product
                </button>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EditProduct;
