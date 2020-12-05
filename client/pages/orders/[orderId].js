import Router from 'next/router'
import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0)
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }
  }, [order])

  if (timeLeft < 0) {
    return <div>Order expired</div>
  }

  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <br/>
      <StripeCheckout
        token={({ id }) => {
          console.log(id)
          doRequest({ token: id })
        }}
        stripeKey="pk_test_51HueZlKvh1eh80oFf6bvuZQBqZmiwXSQEbvHnlyLZQc0EUTzhNecynQi2Q1UtbugGDITN3R5gFZSZBKObFHYV4NK00N5NXxLn8"
        amount={order.ticket.price * 100} //cents
        email={currentUser.email}
      />
      {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow