import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';

import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Helmet from 'react-helmet';

import { Login } from "./pages/Login"
import { path } from "./routes/route"
import { OnlyPublicRoute } from "./routes/OnlyPublicRoute";
import { Home } from './pages/Home';
import { OnlyAdminRoute } from './routes/OnlyAdminRoute';
import { AdminWithdraw } from './pages/AdminWithdraw';
import { Withdraw } from './pages/Withdraw';
import { OnlyUserRoute } from './routes/OnlyUserRoute';
import { SendBalance } from './pages/SendBalance';
import { UserSendBalance } from './pages/UserSendBalance';
import { OnlyPrivateRoute } from './routes/OnlyPrivateRoute';
import { StockProduct } from './pages/StockProduct';
import { HistoryAdminFee } from './pages/HistoryAdminFee';
import { NotFound } from './pages/NotFound';
import { axiosGet } from './API/axios';

function App() {
  const auth = localStorage.getItem("access_token")

  const [userDetail, setUserDetail] = useState();
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const getUserDetail = async () => {
    setLoading(true)

    try {
      const resp1 = await axiosGet(auth, `/v1/users/self`)
      setUserDetail(resp1.data)
    } catch (err) {
      console.log(err.response) 
      if (err.status === 500) {
        setErrorMessage("terjadi kesalahan di internal server, mohon hubungi admin")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserDetail()
  },[])


  return (
    <ChakraProvider theme={theme}>
      <Helmet bodyAttributes={{style: 'background-color : #EDCFA9'}}/>
      <Router>
          <Switch>
            <OnlyPublicRoute exact path={path.login} component={Login}/>
            <OnlyPrivateRoute  exact path={path.root}>
              <Home/>  
            </OnlyPrivateRoute>
            <OnlyUserRoute  exact path={path.withdraw} component={Withdraw}/>
            <OnlyUserRoute  exact path={path.userSendbalance}>
              <UserSendBalance userDetail={userDetail} loadingUDetail={loading}/>  
            </OnlyUserRoute>
            <OnlyAdminRoute  exact path={path.admin} component={AdminWithdraw}/>
            <OnlyAdminRoute  exact path={path.sendBalance} component={SendBalance}/>
            <OnlyAdminRoute exact path={path.stockProduct} component={StockProduct}/>
            <OnlyAdminRoute exact path={path.transaction} component={HistoryAdminFee}/>
            <OnlyAdminRoute exact path={path.any} component={NotFound}/>
          </Switch>
      </Router>

      {/* <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Logo h="40vmin" pointerEvents="none" />
            <Text>
              Edit <Code fontSize="xl">src/App.js</Code> and save to reload.
            </Text>
            <Link
              color="teal.500"
              href="https://chakra-ui.com"
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn Chakra
            </Link>
          </VStack>
        </Grid>
      </Box> */}
    </ChakraProvider>
  );
}

export default App;
