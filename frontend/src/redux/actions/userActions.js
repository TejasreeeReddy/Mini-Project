import axios from 'axios';
import { LOGIN_USER, LOGOUT_USER } from '../constants/userConstants'

export const setReduxUserState = (userCreated) => {
    return (dispatch) => {
        return dispatch({
            type: LOGIN_USER,
            payload: userCreated
        });
    };
};

export const logout = ()=>(dispatch )=>{
    document.location.href = "/login";
    axios.get("/api/logout")
    localStorage.removeItem("userInfo")
    sessionStorage.removeItem("userInfo")
    localStorage.removeItem("cart");
    dispatch({type:LOGOUT_USER})
}

