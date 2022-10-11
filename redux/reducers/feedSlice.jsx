import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { STATUSTEXT } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const feedSlice = createSlice({
	initialState: {
		data: [],
		status: STATUSTEXT.IDLE,
	},
	name: 'feedSlice',
	reducers: {
		clearFeed: (state, action) => {
			state.data = [];
			state.status = STATUSTEXT.IDLE;
		},
		updateLike: (state, action) => {
			const { add, to, uuid } = action.payload;
			add
				? (state.data = state.data.map((post) =>
						post.uuid === uuid
							? {
									...post,
									likes: post.likes.includes(to)
										? post.likes
										: [...post.likes, to],
							  }
							: post
				  ))
				: (state.data = state.data.map((post) =>
						post.uuid === uuid
							? {
									...post,
									likes: post.likes.filter((id) => id !== to),
							  }
							: post
				  ));
		},
		updateComment: (state, action) => {
			const { details, uuid, add } = action.payload;
			if (add) {
				state.data = state.data.map((post) =>
					post.uuid === uuid
						? {
								...post,
								comments: [...post.comments, details],
						  }
						: post
				);
			}
		},
	},
	extraReducers(builder) {
		// FETCH FEED
		builder.addCase(fetchFeed.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchFeed.fulfilled, (state, action) => {
			state.data = action.payload;
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(fetchFeed.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});
	},
});

export const fetchFeed = createAsyncThunk('fetchFeed', async (data) => {
	const _data = await axios.post('/api/getFeed', { ids: data.ids });
	const ids = [];
	_data.data.map((post) => {
		post.comments.map((comment) => {
			!ids.includes(comment._id) && ids.push(comment._id);
		});
		!ids.includes(post.userId) && ids.push(post.userId);
	});
	const __data = await axios.post('/api/getCommentsData', { ids });
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

// export const handleLikeFeedPost = createAsyncThunk(
// 	'handleLikeFeedPost',
// 	async (data) => {
// 		await axios.put('/api/manageLike', {
// 			userId: data.userId,
// 			uuid: data.uuid,
// 			add: data.add,
// 			to: data.to,
// 		});
// 		return {
// 			userId: data.userId,
// 			add: data.add,
// 			to: data.to,
// 			uuid: data.uuid,
// 		};
// 	}
// );

// export const handleCommentFeed = createAsyncThunk(
// 	'handleCommentFeed',
// 	async (data) => {
// 		const date = new Date().toISOString();
// 		await axios.put('/api/manageComments', {
// 			userId: data.userId,
// 			uuid: data.uuid,
// 			add: data.add,
// 			details: {
// 				_id: data.details._id,
// 				commentData: data.details.commentData,
// 				date,
// 			},
// 		});
// 		return {
// 			userId: data.userId,
// 			uuid: data.uuid,
// 			add: data.add,
// 			details: data.details,
// 		};
// 	}
// );

export const { updateLike, updateComment, clearFeed } = feedSlice.actions;
export default feedSlice.reducer;
