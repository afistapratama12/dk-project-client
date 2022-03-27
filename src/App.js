import React from 'react';
import {
  Box,
  ChakraProvider,
  theme,
} from '@chakra-ui/react';

import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import { Login } from "./pages/Login"
import { path } from "./routes/route"
import { OnlyPublicRoute } from "./routes/OnlyPublicRoute";
import { Home } from './pages/Home';
import { OnlyAdminRoute } from './routes/OnlyAdminRoute';
import { AdminWithdraw } from './pages/AdminWithdraw';
import { Withdraw } from './pages/Withdraw';
import { OnlyUserRoute } from './routes/OnlyUserRoute';
import { SendBalance } from './pages/SendBalance';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box
        backgroundColor={'#EDCFA9'}
        bg={'#EDCFA9'}
      >
      <Router>
          <Switch>
            <OnlyPublicRoute exact path={path.login} component={Login}/>
            <OnlyUserRoute  exact path={path.root} component={Home}/>
            <OnlyUserRoute  exact path={path.withdraw} component={Withdraw}/>
            <OnlyAdminRoute  exact path={path.admin} component={AdminWithdraw}/>
            <OnlyAdminRoute  exact path={path.sendBalance} component={SendBalance}/>
          </Switch>
      </Router>
      </Box>

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
