import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Swal from 'sweetalert2';

import '@testing-library/jest-dom';
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';

//mock a la acción 
jest.mock('../../../actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn()
}));

//Mock sweetAlert
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));


//Configuración del store prueba acciones asincronas...
const middlewares = [thunk];
const mockStore = configureStore( middlewares );

const initState = {};
const store = mockStore( initState );
store.dispatch = jest.fn();


const wrapper = mount(
    <Provider store= { store }>
        <LoginScreen />
    </Provider>
)




describe('pruebas en <LoginScreen />', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    })

    test('debe mostrarse correctamente ', () => {
        
        expect( wrapper ).toMatchSnapshot();

    });

    test('debe de llamar el dispatch del login', () => {

        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'Stivenprod10@mail.com'
            }
        });

        wrapper.find('input[name="lPassword"]').simulate('change', {
            target: {
                name: 'lPassword',
                value: '123456'
            }
        });

        wrapper.find('form').at(0).prop('onSubmit')({ //selecciona el formulario que primero encuentra
            preventDefault(){}
        });

        expect( startLogin ).toHaveBeenCalledWith('Stivenprod10@mail.com', '123456');
        
    });

    test('No hay registro si las contrasñeas son diferentes', () => {
        
        
        wrapper.find('input[name="rPassword"]').simulate('change', {
            target: {
                name: 'rPassword',
                value: '123456'
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '1234567'
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({ //selecciona el formulario 2
            preventDefault(){}
        });

        expect( startRegister ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalledWith("Error", "Las contraseñas deben ser iguales", "error");

    });


    test('Registro con contraseñas iguales ', () => {
       
        wrapper.find('input[name="rPassword"]').simulate('change', {
            target: {
                name: 'rPassword',
                value: '123456'
            }
        });

        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '123456'
            }
        });

        wrapper.find('form').at(1).prop('onSubmit')({ //selecciona el formulario 2
            preventDefault(){}
        });

        expect( Swal.fire ).not.toHaveBeenCalled();
        expect( startRegister ).toHaveBeenCalledWith("stiven100@mail.com", "123456", "Stiven...");

    });
    
});
