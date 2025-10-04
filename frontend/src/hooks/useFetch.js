import { useReducer } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { API } from "@/services/api";

const useFetch = (url, params = {}, type = "get") => {
  const init = {
    data: [],
    loading: false,
    error: false,
    success: false,
  };

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "FETCHING":
        return { ...init, loading: true };
      case "FETCHED":
        return { ...init, loading: false, data: action.payload, success: true };
      case "FETCH_ERROR":
        return {
          ...init,
          loading: false,
          error: action.payload,
          success: false,
        };
      case "INIT":
        return { ...init, data: action.payload, success: false };
      default:
        return state;
    }
  }, init);

  let source = axios.CancelToken.source();

  const load = async (
    data,
    methode,
    resType = "json",
    noty = false,
    hasFile = false,
    UrlParams = ""
  ) => {
    dispatch({ type: "FETCHING" });

    let opt = {
      data: data || params,
      method: methode || type,
      cancelToken: source.token,
      responseType: resType,
    };

    if (hasFile) {
      params["headers"] = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      };
    }

    return await API(url + UrlParams, opt)
      .then((resp) => {
        dispatch({ type: "FETCHED", payload: resp.data });
        if (noty) {
          let message = "Done successfully";
          toast.success(message, { autoClose: 2000 });
        }
        return resp.data;
      })
      .catch((err) => {
        if (!axios.isCancel(err)) {
          dispatch({ type: "FETCH_ERROR", payload: err?.response?.data });

          let message =
            typeof err?.response?.data === "string"
              ? err?.response?.data
              : JSON.stringify(err?.response?.data);
          toast.error(message, {
            autoClose: false,
          });
        }
        return false;
      });
  };

  return [state, load, source];
};

export default useFetch;
