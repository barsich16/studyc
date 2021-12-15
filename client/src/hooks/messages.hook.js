import {useCallback} from 'react'
import { message} from 'antd';

export const useMessage = () => {
    return useCallback(status => {
        if(status) {
            if(status.code === 1) {
                message.error(status.message);
            } else {
                message.success(status.message);
            }

        }
    },[])
}
