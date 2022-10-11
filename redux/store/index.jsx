import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE, createWrapper } from 'next-redux-wrapper';
import currentUserReducer from '../reducers/currentUserSlice';
import userReducer from '../reducers/userSlice';
import feedReducer from '../reducers/feedSlice';
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	REGISTER,
	PURGE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const combinedReducers = combineReducers({
	currentUser: currentUserReducer,
	user: userReducer,
	feed: feedReducer,
});

const masterReducer = (state, action) => {
	if (action.type === HYDRATE) {
		if (action.payload.currentUser.wantToLogout) return action.payload;
		return state;
	}
	return combinedReducers(state, action);
};

const persistConfig = {
	key: 'root',
	storage,
};

const persistedReducer = persistReducer(persistConfig, masterReducer);

export const myStore = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}),
});

export const persist = persistStore(myStore);
export const wrapper = createWrapper(() => myStore);

// FOR DEBUGGING
// export const wrapper = createWrapper(() => myStore, { debug: true });
