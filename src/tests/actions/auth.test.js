import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import '@testing-library/jest-dom';

import { startChecking, startLogin, startRegister } from '../../actions/auth';
import { types } from '../../types/types';
import * as fetchModule from '../../helpers/fetch';


jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

//Configuración del store prueba acciones asincronas...
const middlewares = [thunk];
const mockStore = configureStore( middlewares );

const initState = {};
let store = mockStore( initState );

Storage.prototype.setItem = jest.fn();

describe('Pruebas en las acciones Auth', () => {

    beforeEach(() => {
        store = mockStore( initState );
        jest.clearAllMocks();
    });


    test('startLogin correcto', async() => {

        await store.dispatch( startLogin('stiven@mail.com', '123456' ) );

        const actions =  store.getActions();
        
        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload:{
                uid: expect.any(String),
                name: expect.any(String)
            }
        })

        expect( localStorage.setItem ).toHaveBeenCalledWith( 'token', expect.any(String) );
        expect( localStorage.setItem ).toHaveBeenCalledWith( 'token-init-date', expect.any(Number) );

        //token = localStorage.setItem.mock.calls[0][1]
        //console.log(localStorage.setItem.mock.calls[0][1]);
    });
    
    test('startLogin incorrecto', async() => {

        await store.dispatch( startLogin('stiven@mail.com', '12345677' ) );
        let actions =  store.getActions();

        expect( actions ).toEqual([]);
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "Password incorrecto", "error");
    
        await store.dispatch( startLogin('stiven22x@mail.com', '12345677' ) );
        actions =  store.getActions();
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "El usuario no existe con ese email", "error");
    });

    test('startRegister correcto', async() => {

        fetchModule.fetchSinToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'Stiven',
                    token: '123abc123ac'
                }
            }
        }))

        await store.dispatch( startRegister('test@test.com', '123456', 'test') );
        
        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Stiven'
            }
        })   
        
        expect( localStorage.setItem ).toHaveBeenCalledWith( 'token', '123abc123ac' );
        expect( localStorage.setItem ).toHaveBeenCalledWith( 'token-init-date', expect.any(Number) );

    });

    test('startChecking correcto', async() => {

        fetchModule.fetchConToken = jest.fn( () => ({
            json() {
                return {
                    ok: true,
                    uid: '123',
                    name: 'Stiven',
                    token: '123abc123ac'
                }
            }
        }))

        await store.dispatch( startChecking() );

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Stiven'
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', '123abc123ac' );


        
    })
    
    
    
    
})
