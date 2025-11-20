import { getToken } from "./AuthService"; // auth.js dosyasından getToken fonksiyonunu içe aktar

const apiRequest = async ({
  baseUrl = "http://192.168.1.2:5035", //backend url
  endpoint,
  method = "GET",
  queryParams = {},
  body = null,
}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;
  const token = await getToken(); // Token'ı alıyoruz

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  return fetch(url, options)
    .then(async (res) => {
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Bir hata oluştu");
      return json;
    })
    .catch((err) => {
      throw err;
    });
};

// kullanıcı giriş bilgireinin doğrulanması.
export const signIn = async (username, password) => {
  try {
    const response = await apiRequest({
      endpoint: "/api/account/login",
      method: "POST",
      body: { username, password },
    });

    console.log("user bilgileri sign in", response);

    const token = response.token;
    const user = {
      username: response.username,
      email: response.email,
      profilePicture: response.profilePicture,
    };

    if (token) {
      return { success: true, token, user };
    } else {
      throw new Error("Token alınamadı");
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
};

//public listelerin çekilmesi
export const getPublicLists = async () => {
  try {
    const response = await apiRequest({
      endpoint: "/api/lists/public", // public listeler endpointi
      method: "GET",
    });
    return { success: true, data: response };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

//liste oluştur

export const createList = async (listData) => {
  try {
    const response = await apiRequest({
      endpoint: "/api/lists",
      method: "POST",
      body: listData,
    });

    return { success: true, data: response };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

// kullanıcı uygulamayı kapattığında state silindiği için tekrar açtığında
// jwt token ile bilgilerini çekiyoruz
export const userInfo = async () => {
  try {
    const response = await apiRequest({
      endpoint: "/api/account/me",
      method: "GET",
    });

    const user = {
      username: response.username ?? response.userName, // normalize
      email: response.email,
      profilePicture: response.profilePicture,
      id: response.id,
    };

    return { success: true, data: user };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

//kullanıcı bilgilerini güncelleme fonksiyounu
export const userUpdate = async ({ user }) => {
  try {
    const response = await apiRequest({
      endpoint: "/api/account/update-profile",
      method: "PUT",
      body: user,
    });
    const token = response.token;
    const updatedUser = {
      username: response.username,
      email: response.email,
      profilePicture: response.profilePicture,
    };

    if (token) {
      return { success: true, token, user: updatedUser };
    } else {
      throw new Error("Token alınamadı");
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
};

//list optionsları post ediyoruz.
export const createListOption = async ({ listId, name, imageUrl }) => {
  try {
    const response = await apiRequest({
      endpoint: "/api/listoptions", // backend ListOption POST endpoint
      method: "POST",
      body: {
        listId,
        name,
        imageUrl,
      },
    });

    return { success: true, data: response };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

//kendi listeleriizi çekicez.
export const getMyLists = async () => {
  try {
    const response = await apiRequest({
      endpoint: "/api/lists/my-lists",
      method: "GET",
    });

    return { success: true, data: response };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

//list id ile list optionsları alma .
export const getListDetail = async ({ listId }) => {
  try {
    const response = await apiRequest({
      endpoint: "/api/listoptions/" + listId,
      method: "GET",
    });
    return { success: true, data: response };
  } catch (err) {
    return { success: false, message: err.message };
  }
};
