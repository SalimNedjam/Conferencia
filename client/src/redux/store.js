import { createStore } from 'redux';
import rootReducer from "./reducers";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootPersistConfig = {
  key: 'root',
  storage: storage,
};
const pReducer = persistReducer(rootPersistConfig, rootReducer);
const store = createStore(pReducer);
const persistor = persistStore(store);

export { persistor, store };
