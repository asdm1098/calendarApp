import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moment from 'moment';

import '@testing-library/jest-dom';
import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdated } from '../../../actions/events';
import { act } from '@testing-library/react';
import Swal from 'sweetalert2';

//mock a la acción 
jest.mock('../../../actions/events', () => ({
    eventStartUpdated: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
}));
//mock sweetAlert
jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

//Configuración del store prueba acciones asincronas...
const middlewares = [thunk];
const mockStore = configureStore( middlewares );

const now = moment().minute(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours')

const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hola mundo',
            notes: 'Algunas notas',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth:{
        uid: '123',
        name: 'Stiven'
    },
    ui: {
        modalOpen: true
    }

};

const store = mockStore( initState );
store.dispatch = jest.fn();


const wrapper = mount(
    <Provider store= { store }>
        <CalendarModal />
    </Provider>
)


describe('Pruebas en <CalendarModal />', () => {

    beforeEach( () => {
        jest.clearAllMocks();
    })

    test('debe de mostrar el modal', () => {

        //expect( wrapper.find('.modal').exists() ).toBe( true );
        expect( wrapper.find('Modal').prop('isOpen') ).toBe(true);

    });

    test('debe de llamar la acción de actualizar y cerrar modal ', () => {
        
        wrapper.find('form').simulate('submit', {
            preventDefault( ){}
        });

        expect( eventStartUpdated ).toHaveBeenCalledWith( initState.calendar.activeEvent );
        expect( eventClearActiveEvent ).toHaveBeenCalled();

    });

    test('debe de mostrar error si falta el titulo', () => {

        wrapper.find('form').simulate('submit', {
            preventDefault( ){}
        });

        expect( wrapper.find( 'input[name="title"]').hasClass('is-invalid') ).toBe(true);
        
    });
    
    test('debe de crear un nuevo evento', () => {
        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            auth:{
                uid: '123',
                name: 'Stiven'
            },
            ui: {
                modalOpen: true
            }
        
        };
        
        const store = mockStore( initState );
        store.dispatch = jest.fn();
        
        
        const wrapper = mount(
            <Provider store= { store }>
                <CalendarModal />
            </Provider>
        );


        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            } 
        });

        wrapper.find('form').simulate('submit', {
            preventDefault( ){}
        });


        expect( eventStartAddNew ).toHaveBeenLastCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: 'Hola pruebas',
            notes: ''
        });

        expect( eventClearActiveEvent ).toHaveBeenCalled();

    });

    test('debe de validar las fechas ', () => {
       
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Hola pruebas'
            } 
        });

        const hoy = new Date();
        
        act( ()=> {
            wrapper.find('DateTimePicker').at(1).prop('onChange')(hoy);
        })

        wrapper.find('form').simulate('submit', {
            preventDefault( ){}
        });

        expect( Swal.fire ).toHaveBeenCalledWith("Error", "La fecha fin debe ser mayor a la de inicio", "error");


    });
    
    
    
    
    
})
