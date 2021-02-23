import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import '@testing-library/jest-dom';
import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';

//mock a la acción 
jest.mock('../../../actions/events', () => ({
    eventStartDelete: jest.fn()
}));


//Configuración del store prueba acciones asincronas...
const middlewares = [thunk];
const mockStore = configureStore( middlewares );

const initState = {};
const store = mockStore( initState );
store.dispatch = jest.fn();


const wrapper = mount(
    <Provider store= { store }>
        <DeleteEventFab />
    </Provider>
)

describe('Pruebas en <DeleteEventFab />', () => {

    test('debe mostrarse correctamente', () => {

        expect( wrapper ).toMatchSnapshot();

    });

    test('debe de llamar el eventStartDelte al hacer click ', () => {
        
        wrapper.find('button').prop('onClick')();

        expect( eventStartDelete ).toHaveBeenCalled();

    });
    
});
