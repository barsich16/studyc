import {useCallback, useState} from "react";
import {message} from "antd";
import {useDispatch} from "react-redux";

export const useFetching = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const fetching = useCallback(async (callback, ...parametres) => {
        try {
            setLoading(true);
            const result = await dispatch(callback(...parametres));
            if (!result.notShow) {
                message.success(result.message);
            }
        } catch (e) {
            message.error(e.message);
        } finally {
            setLoading(false)
        }
    }, [])
    return {fetching, loading};
}
