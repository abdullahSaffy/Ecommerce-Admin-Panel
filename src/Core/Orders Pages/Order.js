import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'react-simple-snackbar';
import { useLocation, useParams } from 'react-router-dom';
import { initialState } from './initialState';
import { toCommas } from '../utils/utils';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { Container, Grid } from '@mui/material';
import Divider from '@material-ui/core/Divider';
// import ProgressButton from 'react-progress-button';
import LoadingButton from '@mui/lab/LoadingButton';

import './InvoiceDetails.css';
import axios from 'axios';
import { saveAs } from 'file-saver';
import profilePic from '../images/khan.png';
import ReactLoading from 'react-loading';

const InvoiceDetails = (props) => {
  console.log('props', props);
  const location = useLocation();
  const [invoiceData, setInvoiceData] = useState(initialState);
  const [rates, setRates] = useState(0);
  const [vat, setVat] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { id } = useParams();
  const history = useHistory();
  const [order, setOrder] = useState({});
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [open, setOpen] = useState(false);
  const [isSendCustomer, setIsSendCustomer] = useState(false);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);

  const [downloadStatus, setDownloadStatus] = useState(null);
  const orderId = props.match.params.orderId;

  const iconSize = {
    height: '18px',
    width: '18px',
    marginRight: '10px',
    color: 'gray',
  };
  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    table: {
      minWidth: 650,
    },

    headerContainer: {
      // display: 'flex'
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(1),
      backgroundColor: '#f2f2f2',
      borderRadius: '10px 10px 0px 0px',
    },
  }));
  const classes = useStyles();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orderResponse, userResponse] = await Promise.all([
        axios.get(`http://localhost:4000/api/orderCart/${orderId}`),
        getOrderUser(),
      ]);

      const order = orderResponse.data.cart;
      setOrder(order);
      const user = userResponse.data.data;
      setUser(user);
      setLoading(false);
    } catch (error) {
      console.log('Error:', error);
      setLoading(false);
    }
  };

  const getOrderUser = async () => {
    const orderResponse = await axios.get(
      `http://localhost:4000/api/orderCart/${orderId}`
    );
    const order = orderResponse.data.cart;

    const userResponse = await axios.get(
      `http://localhost:4000/api/user/${order.user}`
    );
    const user = userResponse.data.data;

    return userResponse;
  };

  console.log('user: ', user);
  console.log('order: ', order);

  const createAndDownloadPdf = () => {
    setIsLoadingPdf(true);
    axios
      .post(`http://localhost:4000/create-pdf`, {
        name: user?.name,
        address: 'Gujranwala',
        phone: '12345678',
        email: user?.email,
        dueDate: user?.createdAt,
        date: user?.createdAt,
        id: '1',
        notes: 'notes',
        subTotal: toCommas(order?.totalCost),
        total: toCommas(order?.totalCost),
        type: 'type',
        vat: 'vat',
        items: order?.items,
        status: 'status',
        totalAmountReceived: toCommas(order?.totalCost),
        balanceDue: toCommas(order?.totalCost),
        company: 'company',
      })
      .then(() =>
        axios.get('http://localhost:4000/fetch-pdf', {
          responseType: 'blob',
        })
      )
      .then((res) => {
        console.log('res data:', res);
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        saveAs(pdfBlob, 'invoice.pdf');
      })
      .then(() => setIsLoadingPdf(false));
  };

  //SEND PDF INVOICE VIA EMAIL
  const sendPdf = (e) => {
    console.log('order?.user:');
    e.preventDefault();
    setIsSendCustomer(true);
    axios
      .post('http://localhost:4000/send-pdf', {
        name: user?.name,
        address: 'Gujranwala',
        phone: '12345678',
        email: user?.email,
        dueDate: user?.createdAt,
        date: user?.createdAt,
        id: '1',
        notes: 'notes',
        subTotal: toCommas(order?.totalCost),
        total: toCommas(order?.totalCost),
        type: 'type',
        vat: 'vat',
        items: order?.items,
        status: 'status',
        totalAmountReceived: toCommas(order?.totalCost),
        balanceDue: toCommas(order?.totalCost),
        link: `http://localhost:3000/invoice/${orderId}`,
        company: 'company',
      })
      .then(() => setIsSendCustomer(false))
      .catch((error) => {
        console.log(error);
        setIsSendCustomer(false);
      });
  };

  return (
    <div className='mainDev'>
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
        <div>
          <div className='testing'>
            <LoadingButton
              loading={isSendCustomer}
              variant='outlined'
              onClick={sendPdf}
            >
              Send to Customer
            </LoadingButton>

            <LoadingButton
              loading={isLoadingPdf}
              variant='outlined'
              onClick={createAndDownloadPdf}
              // state={downloadStatus}
            >
              Download PDF
            </LoadingButton>
          </div>
          <div className='invoiceLayout'>
            <Container className='subContainer1'>
              <Grid
                container
                justifyContent='space-between'
                style={{ padding: '30px 0px' }}
              >
                <Grid
                  item
                  onClick={() => history.push('/settings')}
                  style={{ cursor: 'pointer' }}
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt='Logo'
                      style={{ width: '150px' }}
                    />
                  ) : (
                    <h2>{user?.name}</h2>
                  )}
                </Grid>

                <Grid item style={{ marginRight: 40, textAlign: 'right' }}>
                  <Typography
                    style={{
                      lineSpacing: 1,
                      fontSize: 45,
                      fontWeight: 700,
                      color: 'gray',
                    }}
                  >
                    Invoice
                  </Typography>
                  <Typography variant='overline' style={{ color: 'gray' }}>
                    No:
                  </Typography>
                  <Typography variant='body2'>
                    {/* {invoiceData?.invoiceNumber} */}
                    12
                  </Typography>
                </Grid>
              </Grid>
            </Container>

            <Divider />

            <Container className='subContainer'>
              <Grid
                container
                justifyContent='space-between'
                style={{ marginTop: '40px' }}
              >
                <Grid item>
                  <Container style={{ marginBottom: '20px' }}>
                    <Typography
                      variant='overline'
                      style={{ color: 'gray' }}
                      gutterBottom
                    >
                      From
                    </Typography>
                    <Typography
                      variant='subtitle2'
                      style={{ paddingBottom: '0px !important' }}
                    >
                      khanBabaStore
                    </Typography>
                    <Typography variant='body2'>
                      khanBabaStore@gmail.com
                    </Typography>
                    <Typography variant='body2'>1234567</Typography>
                    <Typography variant='body2' gutterBottom>
                      Gujranwala
                    </Typography>
                  </Container>

                  <Container>
                    <Typography
                      variant='overline'
                      style={{ color: 'gray', paddingRight: '3px' }}
                      gutterBottom
                    >
                      Bill to
                    </Typography>

                    <Typography
                      variant='subtitle2'
                      gutterBottom
                      style={{ color: 'red', marginBottom: '-20px !important' }}
                    >
                      {user?.name}
                    </Typography>
                    <Typography variant='body2'>{user?.email}</Typography>
                    <Typography variant='body2'>12345678</Typography>
                    <Typography variant='body2'>Pakistan,Gujranwala</Typography>
                  </Container>
                </Grid>

                <Grid item style={{ marginRight: 20, textAlign: 'right' }}>
                  <Typography
                    variant='overline'
                    style={{ color: 'gray' }}
                    gutterBottom
                  >
                    Status
                  </Typography>
                  <Typography
                    variant='h6'
                    gutterBottom
                    // style={{ color: checkStatus() }}
                  >
                    {/* {totalAmountReceived >= total ? 'Paid' : status} */}
                    Paid
                  </Typography>
                  <Typography
                    variant='overline'
                    style={{ color: 'gray' }}
                    gutterBottom
                  >
                    Date
                  </Typography>
                  <Typography variant='body2' gutterBottom>
                    {moment().format('MMM Do YYYY')}
                  </Typography>
                  <Typography
                    variant='overline'
                    style={{ color: 'gray' }}
                    gutterBottom
                  >
                    Due Date
                  </Typography>
                  <Typography variant='body2' gutterBottom>
                    {selectedDate
                      ? moment(selectedDate).format('MMM Do YYYY')
                      : '27th Sep 2021'}
                  </Typography>
                  <Typography variant='overline' gutterBottom>
                    Amount
                  </Typography>
                  <Typography variant='h6' gutterBottom>
                    {order.totalCost}
                  </Typography>
                </Grid>
              </Grid>
            </Container>

            <form>
              <div>
                <TableContainer component={Paper}>
                  <Table className={classes.table} aria-label='simple table'>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Disc(%)</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order?.items?.map((itemField, index) => (
                        <TableRow key={index}>
                          <TableCell scope='row' style={{ width: '40%' }}>
                            <InputBase
                              style={{
                                width: '100%',
                              }}
                              outline='none'
                              sx={{ ml: 1, flex: 1 }}
                              type='text'
                              name='itemName'
                              value={itemField?.title}
                              placeholder='Item name or description'
                              readOnly
                            />
                          </TableCell>
                          <TableCell align='right'>
                            <InputBase
                              sx={{ ml: 1, flex: 1 }}
                              type='number'
                              name='quantity'
                              value={itemField?.qty}
                              placeholder='0'
                              readOnly
                            />
                          </TableCell>
                          <TableCell align='right'>
                            <InputBase
                              sx={{ ml: 1, flex: 1 }}
                              type='number'
                              name='unitPrice'
                              value={itemField?.price / itemField.qty}
                              placeholder='0'
                              readOnly
                            />
                          </TableCell>
                          <TableCell align='right'>
                            <InputBase
                              sx={{ ml: 1, flex: 1 }}
                              type='number'
                              name='discount'
                              // value={itemField?.discount}
                              value={0}
                              readOnly
                            />
                          </TableCell>
                          <TableCell align='right'>
                            <InputBase
                              sx={{ ml: 1, flex: 1 }}
                              type='number'
                              name='amount'
                              value={itemField?.price}
                              readOnly
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              <div className='invoiceSummary'>
                <div className='summary'>Invoice Summary</div>
                <div className='summaryItem'>
                  <p>Subtotal:</p>
                  <h4>{order.totalCost}</h4>
                </div>
                <div className='summaryItem'>
                  <p>{`VAT(${rates}%):`}</p>
                  <h4>{vat}</h4>
                </div>
                <div className='summaryItem'>
                  <p>Total</p>
                  <h4>{order.totalCost}</h4>
                </div>
                <div className='summaryItem'>
                  <p>Paid</p>

                  <h4>{order.totalCost}</h4>
                </div>

                <div className='summaryItem'>
                  <p>Balance</p>
                  <h4
                    style={{
                      color: 'black',
                      fontSize: '18px',
                      lineHeight: '8px',
                    }}
                  >
                    {order.totalCost}
                  </h4>
                </div>
              </div>

              <div className='note'>
                <h4 style={{ marginLeft: '-10px' }}>Note/Payment Info</h4>
                <p style={{ fontSize: '14px' }}>online</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
