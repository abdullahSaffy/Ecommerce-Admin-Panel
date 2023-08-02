import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import './AddCategory.css';

function AddCategory() {
  const [imagePreview, setImagePreview] = useState('');
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ['image/png', 'image/jpeg', 'image/jpg'];

  function handleImageChange(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
    }
  }

  const validationSchema = Yup.object({
    title: Yup.string().required('Category Name is required'),
    image: Yup.mixed().required('Category Image is required'),
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Adding');

        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('imagePath', values.image);
        const response = await axios.post(
          'http://localhost:4000/api/newCategory',
          formData
        );
        console.log('response: ', response);
        setImagePreview('');
        formik.resetForm();
      } catch (err) {
        console.log('Error : ' + err.message);
      }
    },
  });

  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        <Col className='add-category-content' lg={10}>
          <h4>Add Category</h4>
          <p>
            Please fill the category details in the form below to add a new
            category.
          </p>
          <Card className='add-product-form-card'>
            <Form onSubmit={formik.handleSubmit}>
              <div className='add-product-input-div'>
                <p>Category Name</p>
                <input
                  type='text'
                  name='title'
                  value={formik.values.title}
                  onChange={formik.handleChange}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className='error' style={{ color: 'red' }}>
                    {formik.errors.title}
                  </div>
                )}
              </div>
              <div className='add-category-image-div'>
                <div
                  onClick={() => {
                    imageButtonRef.current.click();
                  }}
                  className='category-image-div'
                >
                  <Form.Control
                    ref={imageButtonRef}
                    style={{ display: 'none' }}
                    type='file'
                    name='image'
                    accept='image/*'
                    onChange={(event) => {
                      formik.setFieldValue(
                        'image',
                        event.currentTarget.files[0]
                      );
                      handleImageChange(event);
                    }}
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt='preview' />
                  ) : (
                    <p>Add category image</p>
                  )}
                </div>
                {formik.touched.image && formik.errors.image && (
                  <div className='error' style={{ color: 'red' }}>
                    {formik.errors.image}
                  </div>
                )}
              </div>
              <button type='submit' className='add-category-btn'>
                Add Category
              </button>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddCategory;
