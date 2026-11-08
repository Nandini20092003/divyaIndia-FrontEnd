import { useCallback, useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(Boolean(url));
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (signal) => {
    if (!url) {
      setData([]);
      setLoading(false);
      setError("A request URL is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        credentials: "include",
        signal,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const result = await response.json();
      setData(result?.data ?? []);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message || "Unable to fetch data");
      }
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

  return { data, loading, error, fetchData: () => fetchData() };
};

export default useFetch;
