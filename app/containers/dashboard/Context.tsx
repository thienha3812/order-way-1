import React from 'react';

type IContext = {
  openDrawer: boolean;
  setOpenDrawer: (value: boolean) => void;
};
export const DashBoardContext = React.createContext<IContext>({
  openDrawer: false,
  setOpenDrawer: (value: boolean) => {},
});
export const ContextProvider = DashBoardContext.Provider;
