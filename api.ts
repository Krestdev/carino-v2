import useStore from "@/context/store";
import axios from "axios";

const axiosConfig = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { token, logout } = useStore();
  const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  axiosClient.interceptors.response.use(
    (response) => {
      // console.log(response.data.data);
      return response;
    },
    (error) => {
      try {
        const { response } = error;
        console.log(response, process.env.NEXT_PUBLIC_API);
        if (response.status === 401) {
          logout();
        }
      } catch (error) {
        console.error(error);
      }
      throw error;
    }
  );

  return axiosClient;
};

export default axiosConfig;
