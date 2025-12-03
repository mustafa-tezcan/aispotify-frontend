import { getToken } from "./AuthService"; // auth.js dosyasından getToken fonksiyonunu içe aktar

const apiRequest = async ({
  baseUrl = "http://localhost:5035",
  endpoint,
  method = "GET",
  queryParams = {},
  body = null,
}) => {
  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${baseUrl}${endpoint}${queryString ? `?${queryString}` : ""}`;
  const token = await getToken();

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  console.log("=== API REQUEST ==="); // ✅ Log ekle
  console.log("URL:", url);
  console.log("Method:", method);
  console.log("Headers:", options.headers);
  console.log("Body:", body);
  console.log("=== END ===");

  return fetch(url, options)
    .then(async (res) => {
      console.log("=== API RESPONSE ==="); // ✅ Log ekle
      console.log("Status:", res.status);
      console.log("OK:", res.ok);

      const text = await res.text(); // ✅ Önce text olarak al
      console.log("Raw Response:", text);
      console.log("=== END ===");

      if (!text) {
        // ✅ Boş response kontrolü
        throw new Error("Backend boş response döndü");
      }

      const json = JSON.parse(text); // ✅ Manuel parse

      if (!res.ok) throw new Error(json.message || "Bir hata oluştu");
      return json;
    })
    .catch((err) => {
      console.error("❌ API Error:", err);
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

// kullanıcı uygulamayı kapattığında state silindiği için tekrar açtığında
// jwt token ile bilgilerini çekiyoruz
export const userInfo = async () => {
  try {
    const response = await apiRequest({
      endpoint: "/api/auth/me",
      method: "GET",
    });

    const user = {
      id: response.id,
      username: response.displayName, // normalize
      email: response.email,
      profilePicture: response.profileImageUrl,
      spotifyId: response.spotifyId,
      followers: response.followers,
    };

    return { success: true, data: user };
  } catch (err) {
    return { success: false, message: err.message };
  }
};

export const suggest = async (prompt) => {
  // ✅ prompt parametresi ekle
  try {
    const response = await apiRequest({
      endpoint: "/api/playlist/suggest", // ✅ "suggesest" → "suggest" (typo düzelt)
      method: "GET",
      queryParams: { prompt }, // ✅ Prompt'u query param olarak gönder
    });

    // ✅ Backend zaten { success: true, data: [...] } dönüyor
    return response; // Direkt döndür
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const exportToSpotify = async (name, description, tracks) => {
  try {
    console.log("=== EXPORT REQUEST ===");
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Tracks:", tracks);
    console.log("=== END ===");

    const response = await apiRequest({
      endpoint: "/api/playlist/export",
      method: "POST",
      body: { name, description, tracks },
    });

    console.log("=== EXPORT RESPONSE ===");
    console.log("Response:", response);
    console.log("=== END ===");

    return response;
  } catch (error) {
    console.log("=== EXPORT ERROR ===");
    console.log("Error:", error);
    console.log("=== END ===");
    return { success: false, message: error.message };
  }
};
