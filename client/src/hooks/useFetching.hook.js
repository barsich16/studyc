import {useCallback, useState} from "react";
import {message} from "antd";

export const useFetching = () => {
    const [loading, setLoading] = useState(false);

    const fetching = useCallback(async (callback, ...parametres) => {
        try {
            setLoading(true);
            const result = await callback(...parametres);
            message.success(result.message);
        } catch (e) {
            message.error(e.message);
        } finally {
            setLoading(false)
        }
    }, [])
    return {fetching, loading};
}
