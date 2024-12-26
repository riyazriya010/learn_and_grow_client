// 'use client'

// import { Provider } from "react-redux";
// import store from '../redux/store'



// export const StoreProvider = ({children}:{children:React.ReactNode})=>{
   
//     return(
//         <Provider store={store}>
          
//                 {children}
           
//         </Provider>
//     )

// }

'use client';

import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import store, { persistor } from '../redux/store';

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
