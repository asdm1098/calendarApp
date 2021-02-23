const { authReducer } = require("../../reducers/AuthReducer");
const { types } = require("../../types/types");

const initialState = {
    checking: true,
   // uid: null,
   // name: null
}

describe('pruebas en el authReducer ', () => {
    
    test('debe de retornar el estado por defecto', () => {
        const action = {}
        const state = authReducer( initialState, action )

        expect( state ).toEqual( initialState );

    });

    test('debe de autenticar el usuario', () => {
        const action = {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Stiven'
            }
        };

        const state = authReducer( initialState, action )
        expect( state ).toEqual({ checking: false, uid: '123', name: 'Stiven' });
    });
    
    


})
