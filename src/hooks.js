import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import swal from "sweetalert";

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      let value = JSON.parse(window.localStorage.getItem(key) || defaultValue);
      return value;
    } catch (e) {
      window.localStorage.clear()
      throw new Error(e);
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

function useFetch(request) {
  const [resp, setResp] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    async function getData() {
      try {
        const res = await request;
        setResp(res);
        setIsLoading(false);
      } catch (err) {
        swal("Oops, not found");
        history.push("/");
        console.log(err);
      }
    }
    getData();
  }, []);

  return [resp, isLoading, setResp];
}

export { useLocalStorageState, useFetch };
