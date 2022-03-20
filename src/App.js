import React from 'react';
import {
  ChakraProvider,
  theme,
} from '@chakra-ui/react';
// import { ColorModeSwitcher } from './ColorModeSwitcher';

import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import { Login } from "./pages/Login"
import { path } from "./routes/route"
import { PrivateRoute } from "./routes/PrivateRoute";
import { OnlyPublicRoute } from "./routes/OnlyPublicRoute";
import { Home } from './pages/Home';
import { OnlyAdminRoute } from './routes/OnlyAdminRoute';
import { AdminView } from './pages/AdminView';
import { Withdraw } from './pages/Withdraw';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
          <Switch>
            <OnlyPublicRoute exact path={path.login} component={Login}/>
            <PrivateRoute  exact path={path.root} component={Home}/>
            <PrivateRoute  exact path={path.withdraw} component={Withdraw}/>
            <OnlyAdminRoute  exact path={path.admin} component={AdminView}/>
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
