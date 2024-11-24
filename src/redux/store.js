// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Local storage
import taskReducer from './taskSlice';

// Set up redux-persist configuration
const persistConfig = {
    key: 'root', // key to store in localStorage
    storage, // use localStorage for persistence
};

const persistedReducer = persistReducer(persistConfig, taskReducer);

const store = configureStore({
    reducer: {
        tasks: persistedReducer,
    },
});

const persistor = persistStore(store);

export { store, persistor };
