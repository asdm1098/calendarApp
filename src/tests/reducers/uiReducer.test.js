const { uiOPenModal, uiCloseModal } = require("../../actions/ui");
const { uiReducer } = require("../../reducers/uiReducer");

const initState = {
    modalOpen: false
};


describe('Pruebas en el uiReducer', () => {

    test('debe de retornar el estado por defecto', () => {
        
        const state = uiReducer( initState, {} );
        expect( state ).toEqual( initState );

    });

    test('debe de abrir y cerrar el modal', () => {

        const modalOpen = uiOPenModal();
        const state = uiReducer( initState, modalOpen );

        expect( state ).toEqual({ modalOpen: true });

        const modalClose = uiCloseModal();
        const stateClose = uiReducer( state, modalClose );
        expect( stateClose ).toEqual({ modalOpen: false })
        
    });
    
});
