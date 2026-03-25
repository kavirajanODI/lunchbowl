import axios from "axios";
// import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/context/SidebarContext";

const useAsync = (asyncFunction) => {
  const [data, setData] = useState([] || {});
  const [error, setError] = useState("");
    const [reloadCounter, setReloadCounter] = useState(0);
    // const [errCode, setErrCode] = useState('');
    const [loading, setLoading] = useState(true);
    const {
      invoice,
      status,
      zone,
      time,
      source,
      limitData,
      startDate,
      endDate,
      method,
      isUpdate,
      setIsUpdate,
      currentPage,
      category,
      searchText,
      sortedField,
    } = useContext(SidebarContext);

    const reload = () => setReloadCounter((prev) => prev + 1);
    useEffect(() => {
      let unmounted = false;
      let source = axios.CancelToken.source();
      (async () => {
        setLoading(true);
        try {
          const res = await asyncFunction({ cancelToken: source.token });
          if (!unmounted) {
            setData(res);
            setError("");
            setLoading(false);
          }
        } catch (err) {
          if (!unmounted) {
            setError(err.message);
            if (axios.isCancel(err)) {
              setError(err.message);
              setLoading(false);
              setData([]);
            } else {
              setError(err.message);
              setLoading(false);
              setData([]);
            }
          }
        }
      })();

      setIsUpdate(false);

      return () => {
        unmounted = true;
        source.cancel("Cancelled in cleanup");
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      invoice,
      status,
      zone,
      time,
      method,
      source,
      limitData,
      startDate,
      endDate,
      isUpdate,
      currentPage,
      category,
      searchText,
      sortedField,
      reloadCounter,
    ]);

    return {
      data,
      error,
      loading,
      reload,
    };
};

export default useAsync;
