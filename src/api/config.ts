const API_BASE_URL = "https://inbtp-server.onrender.com/api/" // "http://localhost:8080/api/"
const SOCKET_URL = "https://inbtp-server.onrender.com/api/"

const CLOUDINARY_ENDPOINTS = {
    CLOUDINARY_CLOUD_NAME: "dujxkvyf8",
    CLOUDINARY_UPLOAD_PRESET: "ml_default",
    CLOUDINARY_API_KEY: "913743655576554",
    CLOUDINARY_API_SECRET: "vzQDZUwxQC2n9g4cmNPLm1_pL6M",
};
export default {
    API: API_BASE_URL,
    SOCKET: SOCKET_URL,
    CLOUDINARY: {...CLOUDINARY_ENDPOINTS},
}