import {useEffect, useState} from "react";

function useFetch(url) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(url);

                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }

                const data = await res.json();
                setData(data);

            } catch (e) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    return {data, loading, error}
}

export default useFetch