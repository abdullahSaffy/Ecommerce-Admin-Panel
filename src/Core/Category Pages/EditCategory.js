import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import Sidebar from '../../Components/Sidebar';
import axios from 'axios';

import './AddCategory.css';
import { useHistory } from 'react-router';

function EditCategory(props) {
  const [imagePreview, setImagePreview] = useState('');
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ['image/png', 'image/jpeg', 'image/jpg'];
  const history = useHistory();
  const [categoryData, setCategoryData] = useState();
  console.log('cate data: ', categoryData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategoryData({ ...categoryData, [name]: value });
    // setCategoryData((prev) => {
    //   return { ...prev, [name]: value };
    // });
  };

  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = () => {
    const categoryId = props.match.params.categoryId;
    axios({
      method: 'get',
      url: `http://localhost:4000/api/category/${categoryId}`,
    }).then((response) => {
      console.log('res:', response.data.data);
      setCategoryData(response.data.data);
    });
  };

  function handleImageChange(event) {
    let selectedFile = event.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      setCategoryData({ ...categoryData, image: selectedFile });
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
    }
  }

  const editCategory = async (event) => {
    event.preventDefault();
    const updatedData = new FormData();
    updatedData.append('title', categoryData.title);
    // updatedData.append('imagePath', image);
    if (image) {
      console.log('imagePath', image);
      updatedData.append('imagePath', image);
    } else {
      console.log('categoryData.imagePath: ', categoryData.imagePath);
      updatedData.append('isOldImage', true);
    }
    try {
      axios
        .put(
          `http://localhost:4000/api/category/update/${props.match.params.categoryId}`,
          updatedData
        )
        .then((response) => {
          console.log('edit data', response);
          setImagePreview();
          setCategoryData({
            title: '',
            imagePath: '',
          });
          history.push('/categories');
        })
        .catch((err) => {
          console.log('err: ', err);
        });
    } catch (err) {
      console.log('Error: ' + err.message);
    }
  };

  // const base64String = btoa(
  //   String.fromCharCode(...new Uint8Array(categoryData?.imagePath?.data?.data))
  // );
  const base64String = btoa(
    new Uint8Array(categoryData?.imagePath?.data?.data)
      .reduce((data, byte) => (data.push(String.fromCharCode(byte)), data), [])
      .join('')
  );
  return (
    <div className='dashboard-parent-div'>
      <Row>
        <Col lg={2}>
          <Sidebar />
        </Col>
        {categoryData && (
          <Col className='add-category-content' lg={10}>
            <h4>Edit Category</h4>
            <p>
              Please fill the category details in the form below to edit
              category information.
            </p>

            <Card className='add-product-form-card'>
              <div className='add-product-input-div'>
                <p>Category Name</p>
                <input
                  type='text'
                  name='title'
                  value={categoryData?.title}
                  onChange={handleChange}
                ></input>
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
                    name='imagePath'
                    accept='image/*'
                    onChange={handleImageChange}
                  />
                  {!imagePreview ? (
                    <img
                      src={
                        base64String
                          ? `data:image/png;base64,${base64String}`
                          : categoryData.imagePath
                      }
                      alt='preview'
                    />
                  ) : (
                    <img src={imagePreview} alt='preview' />
                  )}
                </div>
              </div>
              <button onClick={editCategory} className='add-category-btn'>
                Update Category
              </button>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default EditCategory;
