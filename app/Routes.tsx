/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { DASHBOARD, HOME } from './constants/routes';
import App from './containers/App';
import Loading from './assets/images/loading.gif'

const LazyDashboardPage = React.lazy(() => import('./containers/dashboard'));
const LazyLoginPage = React.lazy(async () => import('./containers/login'));

const LoadingScreen =  () =>{
  return (
    <>
        <div style={{width:"100%",height:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <img  height="150" width="150" src={Loading} />
        </div>
    </>
  )
}

const LoginPage = (props) => (
  <React.Suspense  fallback={<LoadingScreen/>}>
    <LazyLoginPage {...props} />
  </React.Suspense>
);
const DashboardPage = (props) => (
  <React.Suspense fallback={<LoadingScreen/>}>
    <LazyDashboardPage {...props} />
  </React.Suspense>
);

export default function Routes() {
  return (
    <App>
      <Switch>
        <Route path={DASHBOARD} component={DashboardPage} />
        <Route path={HOME} component={LoginPage} />
      </Switch>
    </App>
  );
}
