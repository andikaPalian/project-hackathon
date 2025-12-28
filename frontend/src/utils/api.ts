import axios from "axios";
import { auth } from "./firebase";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
});

// Materials
export const uploadMaterial = async (file: File, title: string, subject: string) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("title", title);
  formData.append("subject", subject);

  const response = await api.post("/materials/upload", formData);

  return response.data;
};

export const getMaterials = async () => {
  const response = await api.get("/materials");
  return response.data;
};

export default api;
