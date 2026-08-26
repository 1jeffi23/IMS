import axios from "axios";

const api = axios.create({
    baseURL: "https://ims-backend-psi.vercel.app/api",
    headers: {
        "Content-Type": "application/json",
    }
});

export default api;