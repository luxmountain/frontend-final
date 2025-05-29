import fetchModel from "../lib/fetchModelData";

const models = {
  userListModel: () => fetchModel("/user/list"),
  userModel: (userId) => fetchModel(`/user/${userId}`),
  photoOfUserModel: (userId) => fetchModel(`/photo/${userId}`),

  login: async (loginName, password) => {
    return await fetchModel('/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ login_name: loginName, password }),
    });
  },

  logout: async () => {
    return await fetchModel('/admin/logout', {
      method: 'POST',
      credentials: 'include'
    });
  },

  addCommentToPhoto: async (photoId, comment) => {
    return await fetchModel(`/commentsOfPhoto/${photoId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ comment }),
    });
  },

  register: async (userData) => {
    return await fetchModel('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('uploadedphoto', file);

    return await fetchModel('/photos/new', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  }
};

export default models;
