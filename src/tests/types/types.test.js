import { types } from '../../types/types';


describe('Pruebas en Types', () => {

    test('Los types deben de ser iguales', () => {
        

        expect ( types ).toEqual({
            uiOpenModal: '[ui] Open modal',
            uiCloseModal: '[ui] Close modal',


            //Acciones calendar reducer
            eventSetActive: '[event] Set Active',
            eventLogout: '[event] Logout events',

            eventStartAddNew: '[event] Start add new',
            eventAddNew: '[event] Add new',
            eventClearActiveEvent: '[event] Clear active event',
            eventUpdated: '[event] Event updated',
            eventDeleted: '[event] Event deleted',
            //
            eventLoaded: '[event] Event loaded',
            


            //autenticación
            authCheckingFinish: '[auth] Finish checking login state',
            authStartLogin: '[auth] Start login',
            authLogin: '[auth] Login',
            authStartRegister: '[auth] Start Register',
            authStartTokenRenew: '[auth] Start token renew',
            authLogout: '[auth] Logout'
        })
    })
    
    
})
