/* eslint react/jsx-props-no-spreading: off */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Home from './components/Home';
import { COUNTER, DASHBOARD, HOME } from './constants/routes';
import App from './containers/App';
const LazyDashboardPage = React.lazy(() => import('./containers/dashboard'));

const LazyLoginPage = React.lazy(() => import('./containers/login'));
// Lazily load routes and code split with webpack
const LazyCounterPage = React.lazy(() =>
  import(/* webpackChunkName: "CounterPage" */ './containers/CounterPage')
);
const CounterPage = (props: Record<string, any>) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyCounterPage {...props} />
  </React.Suspense>
);
const LoginPage = (props) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
    <LazyLoginPage {...props} />
  </React.Suspense>
);
const DashboardPage = (props) => (
  <React.Suspense fallback={<h1>Loading...</h1>}>
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
