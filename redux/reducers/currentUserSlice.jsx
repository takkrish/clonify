import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { STATUSTEXT } from '../constants';
import { v4 as uuid } from 'uuid';
import { HYDRATE } from 'next-redux-wrapper';

const currentUserSlice = createSlice({
	name: 'currentUserSlice',
	initialState: {
		data: {},
		exists: false,
		wantToLogout: false,
		status: STATUSTEXT.IDLE,
		posts: {
			data: [],
			status: STATUSTEXT.IDLE,
		},
		friends: {
			data: [],
			status: STATUSTEXT.IDLE,
		},
		users: {
			data: [],
			status: STATUSTEXT.IDLE,
		},
		explore: {
			data: [],
			status: STATUSTEXT.IDLE,
		},
	},
	reducers: {
		setWantToLogout: (state, action) => {
			state.wantToLogout = action.payload;
		},
		clearUser: (state, action) => {
			state.data = {};
			state.exists = false;
			state.status = STATUSTEXT.IDLE;
			state.posts = {
				data: [],
				status: STATUSTEXT.IDLE,
			};
			state.friends = {
				data: [],
				status: STATUSTEXT.IDLE,
			};
			state.explore = {
				data: [],
				status: STATUSTEXT.IDLE,
			};
			state.users = {
				data: [],
				status: STATUSTEXT.IDLE,
			};
		},
		setUser: (state, action) => {
			state.data = action.payload;
			state.exists = true;
			state.status = STATUSTEXT.IDLE;
		},
		setPosts: (state, action) => {
			state.posts = {
				data: action.payload,
				status: STATUSTEXT.IDLE,
			};
		},
		setFriends: (state, action) => {
			state.friends = {
				data: action.payload,
				status: STATUSTEXT.IDLE,
			};
		},
		addComment: (state, action) => {
			const { details, uuid, add } = action.payload;
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
		},
		updatePostLikes: (state, action) => {
			const { add, to, uuid } = action.payload;
			add
				? (state.posts.data = state.posts.data.map((post) =>
						post.uuid === uuid
							? {
									...post,
									likes: post.likes.includes(to)
										? post.likes
										: [...post.likes, to],
							  }
							: post
				  ))
				: (state.posts.data = state.posts.data.map((post) =>
						post.uuid === uuid
							? {
									...post,
									likes: post.likes.filter((id) => id !== to),
							  }
							: post
				  ));
		},
		addExploreComment: (state, action) => {
			const { details, uuid, add } = action.payload;
			if (add) {
				state.explore.data = state.explore.data.map((post) =>
					post.uuid === uuid
						? {
								...post,
								comments: [...post.comments, details],
						  }
						: post
				);
			}
		},
		updateExploreLikes: (state, action) => {
			const { add, to, uuid } = action.payload;
			add
				? (state.explore.data = state.explore.data.map((post) =>
						post.uuid === uuid
							? {
									...post,
									likes: post.likes.includes(to)
										? post.likes
										: [...post.likes, to],
							  }
							: post
				  ))
				: (state.explore.data = state.explore.data.map((post) =>
						post.uuid === uuid
							? {
									...post,
									likes: post.likes.filter((id) => id !== to),
							  }
							: post
				  ));
		},
	},
	extraReducers(builder) {
		// FETCH USER
		builder.addCase(fetchCurrentUser.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
			state.data = action.payload;
			state.exists = true;
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(fetchCurrentUser.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});

		// UPDATE PROFILE IMAGE
		builder.addCase(updateProfileImg.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(updateProfileImg.fulfilled, (state, action) => {
			state.data = { ...state.data, profileImg: action.payload };
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(updateProfileImg.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});

		// UPDATE COVER IMAGE
		builder.addCase(updateCoverImg.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(updateCoverImg.fulfilled, (state, action) => {
			state.data = { ...state.data, coverImg: action.payload };
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(updateCoverImg.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});

		// HANDLE CONNECTIONS
		builder.addCase(handleConnections.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(handleConnections.fulfilled, (state, action) => {
			const { add, userDetail, userId } = action.payload;
			if (add) {
				!state.data.connections.includes(userId) &&
					state.data.connections.push(userId);
			} else {
				state.data.connections = state.data.connections.filter(
					(id) => id !== userId
				);
				state.friends.data = state.friends.data.filter(
					(friend) => friend._id !== userId
				);
			}
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(handleConnections.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});

		// FETCH POSTS
		builder.addCase(fetchCurrentUserPosts.pending, (state, action) => {
			state.posts.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchCurrentUserPosts.fulfilled, (state, action) => {
			state.posts = {
				data: action.payload,
				status: STATUSTEXT.IDLE,
			};
		});
		builder.addCase(fetchCurrentUserPosts.rejected, (state, action) => {
			state.posts.status = STATUSTEXT.ERROR;
		});

		// CREATE POST
		builder.addCase(createPost.pending, (state, action) => {
			state.posts.status = STATUSTEXT.LOADING;
		});
		builder.addCase(createPost.fulfilled, (state, action) => {
			state.posts.data = [
				{
					...action.payload,
					profileImg: state.data.profileImg,
					username: state.data.username,
				},
				...state.posts.data,
			];
			state.posts.status = STATUSTEXT.IDLE;
		});
		builder.addCase(createPost.rejected, (state, action) => {
			state.posts.status = STATUSTEXT.ERROR;
		});

		// FETCH FRIENDS
		builder.addCase(fetchFriends.pending, (state, action) => {
			state.friends.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchFriends.fulfilled, (state, action) => {
			state.friends = {
				data: action.payload,
				status: STATUSTEXT.IDLE,
			};
		});
		builder.addCase(fetchFriends.rejected, (state, action) => {
			state.friends.status = STATUSTEXT.ERROR;
		});

		// UPDATE FRIENDS
		builder.addCase(addFriend.pending, (state, action) => {
			state.friends.status = STATUSTEXT.LOADING;
		});
		builder.addCase(addFriend.fulfilled, (state, action) => {
			state.friends = {
				data: [...action.payload, ...state.friends.data],
				status: STATUSTEXT.IDLE,
			};
		});
		builder.addCase(addFriend.rejected, (state, action) => {
			state.friends.status = STATUSTEXT.ERROR;
		});

		// FETCH USERS
		builder.addCase(fetchUsers.pending, (state, action) => {
			state.users.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchUsers.fulfilled, (state, action) => {
			state.users = {
				data: action.payload,
				status: STATUSTEXT.IDLE,
			};
		});
		builder.addCase(fetchUsers.rejected, (state, action) => {
			state.users.status = STATUSTEXT.ERROR;
		});

		// CREATE STORY
		builder.addCase(createStory.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(createStory.fulfilled, (state, action) => {
			state.data = {
				...state.data,
				stories: [...state.data.stories, action.payload],
			};
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(createStory.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});

		// EXPLORE SCECTION
		builder.addCase(fetchExplore.pending, (state, action) => {
			state.explore.status = STATUSTEXT.LOADING;
		});
		builder.addCase(fetchExplore.fulfilled, (state, action) => {
			state.explore.data = action.payload;
			state.explore.status = STATUSTEXT.IDLE;
		});
		builder.addCase(fetchExplore.rejected, (state, action) => {
			state.explore.status = STATUSTEXT.ERROR;
		});

		// UPDATE USER DETAILS
		builder.addCase(updateUserDetails.pending, (state, action) => {
			state.status = STATUSTEXT.LOADING;
		});
		builder.addCase(updateUserDetails.fulfilled, (state, action) => {
			state.data = {
				...state.data,
				...action.payload,
			};
			state.status = STATUSTEXT.IDLE;
		});
		builder.addCase(updateUserDetails.rejected, (state, action) => {
			state.status = STATUSTEXT.ERROR;
		});
	},
});

export const createStory = createAsyncThunk('createStory', async (data) => {
	const _uuid = uuid();
	const date = new Date().toISOString();
	const _data = await axios
		.put('/api/createStory', {
			_id: data._id,
			uuid: _uuid,
			date,
			src: data.src,
			type: data.type,
			viewedBy: [],
		})
		.catch((err) => err.response);
	return {
		_id: data._id,
		uuid: _uuid,
		date,
		src: data.src,
		type: data.type,
		viewedBy: [],
	};
});

export const fetchCurrentUser = createAsyncThunk(
	'fetchCurrentUser',
	async (data) => {
		const _data = await axios
			.post('/api/getUserDetail', { _id: data._id })
			.catch((err) => err.response);
		return _data.data;
		``;
	}
);

export const updateUserDetails = createAsyncThunk(
	'updateUserDetails',
	async (data) => {
		const _data = await axios
			.put('/api/update', data)
			.catch((err) => err.response);
		return data;
	}
);

export const updateProfileImg = createAsyncThunk(
	'updateProfileImg',
	async (data) => {
		await axios
			.put('/api/updatePhoto', {
				_id: data._id,
				img: data.img,
				updateCover: false,
				uuid: uuid(),
			})
			.catch((err) => err.response);
		return data.img;
	}
);
export const updateCoverImg = createAsyncThunk(
	'updateCoverImg',
	async (data) => {
		const _data = await axios
			.put('/api/updatePhoto', {
				_id: data._id,
				img: data.img,
				updateCover: true,
				uuid: uuid(),
			})
			.catch((err) => err.response);
		return data.img;
	}
);

export const handleConnections = createAsyncThunk(
	'handleConnections',
	async (data) => {
		await axios
			.put('/api/manageConnection', {
				_id: data._id,
				connection: data.userId,
				add: data.add,
			})
			.catch((err) => err.response);
		return {
			userId: data.userId,
			add: data.add,
			userDetail: data.userDetail,
		};
	}
);

export const fetchCurrentUserPosts = createAsyncThunk(
	'fetchCurrentUserPosts',
	async (data) => {
		const _data = await axios.post('/api/getUserPosts', { _id: data._id });
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
				username: __data.data.filter(
					(user) => user._id === post.userId
				)[0].username,
			};
		});
		return updatedPosts;
	}
);

export const createPost = createAsyncThunk('createPost', async (data) => {
	const _uuid = uuid();
	const currentDate = new Date().toISOString();
	const postData = await axios
		.post('/api/createPost', {
			userId: data._id,
			uuid: _uuid,
			img: data.img,
			caption: data.caption,
			date: currentDate,
		})
		.catch((err) => err.response);
	return {
		userId: data._id,
		uuid: _uuid,
		img: data.img,
		caption: data.caption,
		date: currentDate,
		likes: [],
		comments: [],
		shares: 0,
		saved: 0,
	};
});

export const fetchFriends = createAsyncThunk('fetchFriends', async (data) => {
	const _data = await axios.post('/api/getFriends', { ids: data.ids });
	return _data.data;
});

export const addFriend = createAsyncThunk('addFriend', async (data) => {
	const _data = await axios.post('/api/getFriends', { ids: [data._id] });
	return _data.data;
});

export const fetchUsers = createAsyncThunk('fetchUsers', async (data) => {
	const _data = await axios.post('/api/getAllUsers', { _id: data._id });
	return _data.data;
});

export const fetchExplore = createAsyncThunk('fetchExplore', async (data) => {
	const _data = await axios.post('/api/getExplore', { userId: data.userId });
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

export const {
	clearUser,
	setUser,
	setPosts,
	setFriends,
	addComment,
	updatePostLikes,
	addExploreComment,
	updateExploreLikes,
	setWantToLogout,
} = currentUserSlice.actions;
const currentUserReducer = currentUserSlice.reducer;
export default currentUserReducer;
