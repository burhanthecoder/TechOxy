import { combineReducers } from 'redux';


const userInitial = {username: undefined,name: undefined,email: undefined,photo: undefined,token: undefined,id: undefined,seller: false,admin: false};

const userInfo = ( state = userInitial, action) => {
    switch(action.type){
        case 'LOGIN':
            state = action.payload;
            // console.log('updating')
            return state;
        case 'LOGOUT':
            state = userInitial
            return state;
        default :
            return state;
    }
};

const allReducers = combineReducers({
    userInfo,
});

export default allReducers;