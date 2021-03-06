import 'bootstrap/dist/css/bootstrap.css'
import Header from '../components/header'
import buildClient from '../api/build-client'

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx)
  console.log('MAAAAKING REQUEST')
  const { data } = await client.get('/api/users/currentuser')
  console.log('DAAAATA', data)
  
  let pageProps = {}
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser)
  }

  return {
    pageProps,
    currentUser: data.currentUser
  }
}

export default AppComponent