import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STATUSTEXT } from '../constants';

const userSlice = createSlice({
	name: 'userSlice',
	initialState: {
		data: {},
		posts: {
			data: [],
			status: STATUSTEXT.IDLE,
		},
		status: STATUSTEXT.IDLE,
	},
	reducers: {
		removeUser: (state, action) => {
			state.data = {};
			state.status = STATUSTEXT.IDLE;
			state.posts.data = [];
			state.posts.status = STATUSTEXT.IDLE;
		},
	},
	extraReducers(builder) {
		// FETCH USER
		builder.addCase(fetchUser.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchUser.fulfilled, (state, action) => {
			state.data = action.payload;
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(fetchUser.rejected, (state, action) => {
			console.log(action);
			state.status = STATUSTEXT.ERROR;
		});

		// FETCH POSTS
		builder.addCase(fetchPosts.pending, (state, action) => {
			state.posts.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchPosts.fulfilled, (state, action) => {
			state.posts.data = action.payload;
			state.posts.status = STATUSTEXT.IDLE;
		});
		builder.addCase(fetchPosts.rejected, (state, action) => {
			state.posts.status = STATUSTEXT.ERROR;
		});

		// HANDLE LIKE POST
		builder.addCase(handleLikePost.pending, (state, action) => {
			// state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(handleLikePost.fulfilled, (state, action) => {
			const { add, to, userId, uuid } = action.payload;
			if (add) {
				state.posts.data = state.posts.data.map((post) =>
					post.uuid === uuid
						? {
								...post,
								likes: post.likes.includes(to)
									? post.likes
									: [...post.likes, to],
						  }
						: post
				);
			} else {
				state.posts.data = state.posts.data.map((post) => {
					if (post.uuid === uuid) {
						return {
							...post,
							likes: post.likes.filter((id) => id !== to),
						};
					}
					return post;
				});
			}
			state.posts.status = STATUSTEXT.IDLE;
		});
		builder.addCase(handleLikePost.rejected, (state, action) => {
			state.posts.status = STATUSTEXT.ERROR;
		});
		builder.addCase(handleComment.pending, (state, action) => {
			// state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(handleComment.fulfilled, (state, action) => {
			const { details, userId, uuid, add } = action.payload;
			if (add) {
				state.posts.data = state.posts.data.map((post) =>
					post.uuid === uuid
						? {
								...post,
								comments: [...post.comments, details],
						  }
						: post
				);
			}
			state.posts.status = STATUSTEXT.IDLE;
		});
		builder.addCase(handleComment.rejected, (state, action) => {
			state.posts.status = STATUSTEXT.ERROR;
		});
	},
});

export const fetchUser = createAsyncThunk('fetchUser', async (data) => {
	const _data = await axios
		.post('/api/getUserDetail', data)
		.catch((err) => err.response);
	if (_data.status !== 200) return Promise.reject(_data.data);
	return _data.data;
});

export const fetchPosts = createAsyncThunk('fetchPosts', async (data) => {
	const _data = await axios
		.post('/api/getUserPosts', data)
		.catch((err) => err.response);
	const ids = [];
	_data.data.map((post) => {
		post.comments.map((comment) => {
			!ids.includes(comment._id) && ids.push(comment._id);
		});
		!ids.includes(post.userId) && ids.push(post.userId);
	});
	const __data = await axios
		.post('/api/getCommentsData', { ids })
		.catch((err) => err.response);
	const updatedPosts = _data.data.map((post) => {
		const updatedComments = post.comments.map((comment) => {
			const userData = __data.data.filter(
				(user) => comment._id === user._id
			);
			return {
				...comment,
				profileImg: userData[0].profileImg,
				username: userData[0].username,
			};
		});
		return {
			...post,
			comments: updatedComments,
			profileImg: __data.data.filter(
				(user) => user._id === post.userId
			)[0].profileImg,
			username: __data.data.filter((user) => user._id === post.userId)[0]
				.username,
		};
	});
	return updatedPosts;
});

export const handleLikePost = createAsyncThunk(
	'handleLikePost',
	async (data) => {
		await axios.put('/api/manageLike', {
			userId: data.userId,
			uuid: data.uuid,
			add: data.add,
			to: data.to,
		});
		return {
			userId: data.userId,
			add: data.add,
			to: data.to,
			uuid: data.uuid,
		};
	}
);

export const handleComment = createAsyncThunk('handleComment', async (data) => {
	const date = new Date().toISOString();
	await axios.put('/api/manageComments', {
		userId: data.userId,
		uuid: data.uuid,
		add: data.add,
		details: {
			_id: data.details._id,
			commentData: data.details.commentData,
			date,
		},
	});
	return {
		userId: data.userId,
		uuid: data.uuid,
		add: data.add,
		details: data.details,
	};
});

export const { removeUser } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
