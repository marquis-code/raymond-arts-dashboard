import { axiosInstance } from "../axios.config";

export const authApiFactory = {
  $_login(data: any) {
    return axiosInstance.post("admin/auth/login", data);
  }
};
