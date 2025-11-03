import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getChat, accessChat, createGroupChat, fetchGroupChats } from "../../api/chatApi";

// 🔹 Async thunks
export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, thunkAPI) => {
  try {
    return await getChat();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch chats");
  }
});

export const openChat = createAsyncThunk("chat/openChat", async (userId, thunkAPI) => {
  try {
    return await accessChat(userId);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to open chat");
  }
});

export const createGroup = createAsyncThunk("chat/createGroup", async (groupData, thunkAPI) => {
  try {
    return await createGroupChat(groupData);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to create group");
  }
});

export const getGroups = createAsyncThunk("chat/getGroups", async (_, thunkAPI) => {
  try {
    return await fetchGroupChats();
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to load groups");
  }
});

// 🔹 Slice
const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: [],
    activeChat: null,
    groupChats: [],
    unreadCounts: {},
    loading: false,
    error: null,
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
      if (action.payload?._id) {
        state.unreadCounts[action.payload._id] = 0;
      }
    },
    addChat: (state, action) => {
      const exists = state.chats.some((c) => c._id === action.payload._id);
      if (!exists) state.chats.unshift(action.payload);
    },
    removeChat: (state, action) => {
      state.chats = state.chats.filter((c) => c._id !== action.payload);
    },
    clearChats: (state) => {
      state.chats = [];
      state.activeChat = null;
      state.groupChats = [];
      state.unreadCounts = {};
      state.error = null;
    },
    updateLatestMessage: (state, action) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c._id === chatId);
      if (chat) chat.latestMessage = message;
    },
    incrementUnread: (state, action) => {
      const id = action.payload;
      if (!state.unreadCounts[id]) state.unreadCounts[id] = 0;
      state.unreadCounts[id] += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(openChat.fulfilled, (state, action) => {
        state.activeChat = action.payload;
        const exists = state.chats.some((c) => c._id === action.payload._id);
        if (!exists) state.chats.unshift(action.payload);
        state.unreadCounts[action.payload._id] = 0;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groupChats.push(action.payload);
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.groupChats = action.payload;
      });
  },
});

export const {
  setActiveChat,
  addChat,
  removeChat,
  clearChats,
  updateLatestMessage,
  incrementUnread,
} = chatSlice.actions;

export default chatSlice.reducer;
