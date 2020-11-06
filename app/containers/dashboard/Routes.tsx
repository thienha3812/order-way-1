import React, { Fragment } from 'react';
import { Route } from 'react-router';
import { DASHBOARD, DASHBOARD_STAFF_ORDER,DASHBOARD_ORDER_HISTORY,DASHBOARD_BILL_HISTORY } from '../../constants/routes';
import DashboardHome from './children/dashboard-home';
import ManageOrder from './children/dashboard-staff-order';
import OrderHistory from './children/dashboard-order-history';
import BillHistory from './children/dashboard-bill-history';

const Routes = () => {
  return (
    <>
      <Route exact path={DASHBOARD} component={DashboardHome} />
      <Route path={DASHBOARD_STAFF_ORDER} component={ManageOrder} />
      <Route path={DASHBOARD_ORDER_HISTORY} component={OrderHistory} />
      <Route path={DASHBOARD_BILL_HISTORY} component={BillHistory} />
    </>
  );
};

export default Routes;
