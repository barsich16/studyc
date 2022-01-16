// import {useState, useCallback, useEffect} from 'react'
// import {useDispatch, useSelector} from "react-redux";
// import {login} from "../redux/teacherReducer";
//
// const storageName = 'userData';
//
// export const useAuth = () => {
//     const [token, setToken] = useState(null);
//     const [ready, setReady] = useState(false);
//     const [userId, setUserId] = useState(null);
//     const dispatch = useDispatch();
//
//
//     // const login = useCallback((jwtToken, id) => {
//     //
//     //     setToken(jwtToken);
//     //     setUserId(id);
//     //
//     //     localStorage.setItem(storageName, JSON.stringify({
//     //         userId: id, token: jwtToken
//     //     }))
//     //     console.log('localstor: ', localStorage.getItem(storageName));
//     // }, []);
//     //
//     // const logout = useCallback(() => {
//     //     setToken(null);
//     //     setUserId(null);
//     //     localStorage.removeItem(storageName);
//     // }, []);
//     //
//     // useEffect( () => {
//     //
//     //     const data = JSON.parse(localStorage.getItem(storageName));
//     //     if (data && data.token) {
//     //         console.log('DATA USE_EFFECT    : ', data);
//     //         //login(data.token, data.userId);
//     //         dispatch(login(data.userId, data.token));
//     //     }
//     //
//     //     setReady(true);
//     // }, [])
//
//     return {login, logout, token, userId, ready}
// }
