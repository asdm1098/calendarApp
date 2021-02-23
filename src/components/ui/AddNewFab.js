import React from 'react'
import { useDispatch } from 'react-redux'
import { eventClearActiveEvent } from '../../actions/events';
import { uiOPenModal } from '../../actions/ui';

export const AddNewFab = () => {

    const dispatch = useDispatch();

    const handleClickNew = () => {
        dispatch( eventClearActiveEvent() );
        dispatch( uiOPenModal() );    
    }

    return (
        <button
            className="btn btn-primary fab"
            onClick={ handleClickNew }
        >
            <i className="fas fa-plus"></i>
        </button>
        
    )
}
