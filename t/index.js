process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const axios = require('axios');

const cookie =
  'express:sess=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalZtWXpObFl6WTFOMlZsTlRNNU1EQXhPR0poTVRnMFpDSXNJbVZ0WVdsc0lqb2lkR1Z6ZEVCMFpYTjBMbU52YlNJc0ltbGhkQ0k2TVRZd05qWTNOVFUxTjMwLklJdl9IZ0MyUFVFblVyZXVSYjRjY1BGQnFDdXIxWXNLWUtrOFhzUXNocEUifQ==';

const doRequest = async () => {
  const { data } = await axios.post(
    `https://ticketing.dev/api/tickets`,
    { title: 'ticket', price: 5 },
    {
      headers: { cookie },
    }
  );

  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 10 },
    {
      headers: { cookie },
    }
  );

  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`,
    { title: 'ticket', price: 15 },
    {
      headers: { cookie },
    }
  );

  console.log('Request complete');
};

(async () => {
  for (let i = 0; i < 400; i++) {
    doRequest();
  }
})();
