import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';

import moment from 'moment';
import Swal from 'sweetalert2';
import DateTimePicker from 'react-datetime-picker';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveEvent, eventStartAddNew, eventStartUpdated } from '../../actions/events';

//Para posicionarlo en medio
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
}; 

if ( process.env.NODE_ENV !== 'test' ){
    Modal.setAppElement('#root'); //de Index, configuración del modal de react-modal
}

//VALORES INICIALES PARA INPUTS DEL DATEPIKER
const now = moment().minute(0).seconds(0).add(1, 'hours'); //10:00
const nowPlus1 = now.clone().add(1, 'hours'); //HORA ACTUAL + 1 HORA

//valor inicial del formulario, afuera para que no se reconstruya
const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {

    const { modalOpen } = useSelector( state => state.ui );  
    const { activeEvent } = useSelector( state => state.calendar );   
    const dispatch = useDispatch();

    //FECHAS- VALUE INICIAL
    const [ dateStart, setDateStart ] = useState( now.toDate() ); //Value inicio datePiker
    const [ dateEnd, setDateEnd ] = useState( nowPlus1.toDate() ); //Value fecha por defecto, una hora mas tarde
    const [ titleValid, setTitleValid ] = useState(true); //Validar input title
    /*************************/

    //ESTADO INICIAL DEL FORMULARIO

    const [ formValues, setFormValues ] = useState( initEvent );
    
    const { title, notes, start, end } = formValues;
    
    /****************************************/
    useEffect(() => {
        if ( activeEvent ) {
            setFormValues( activeEvent );
        } else {
            setFormValues( initEvent );
        }
    }, [ activeEvent, setFormValues ]);


    //Cerrar el modal, accion Ui//
    const closeModal = () => {

        dispatch( uiCloseModal() );
        dispatch( eventClearActiveEvent() );
        setFormValues( initEvent );

    };
    /***************************/
  

    ////MANEJO DE FORMULARIO DEL MODAL /////////
    const handleInputChange = ({ target }) => {

        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    }
    /*****************************************/

   

    //MANEJO DEL CAMBIO DE VALORES DE LOS VALUE, DE LOS INPUT DATEPIKER EN EL FORMULARIO
    const handleStartDateChange = ( e ) => {
        //el evento será la fecha
        setDateStart( e );
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleEndDateChange = ( e ) => {
        //el evento será la fecha
        setDateEnd( e );
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        
        const momentStart = moment( start );
        const momentEnd = moment( end );

        if( momentStart.isSameOrAfter( momentEnd ) ) {
            return Swal.fire('Error', 'La fecha fin debe ser mayor a la de inicio', 'error');
        }

        if ( title.trim().length < 2 ){
            return setTitleValid(false);
        }

        //Realizar edición de event
        if ( activeEvent ) {
            dispatch( eventStartUpdated( formValues ) );
        } else {
            //TODO: realizar grabación nuevo event
            //console.log(formValues);
            dispatch( eventStartAddNew(formValues) );
        }



        setTitleValid( true );
        closeModal();
    }

    return (
        <Modal
            isOpen={ modalOpen } //mostrar u ocultar modal
            //onAfterOpen={afterOpenModal} estilos al ab
            onRequestClose={ closeModal } //Al hacer click afuera 
            style={ customStyles }
            closeTimeoutMS={ 200 } //MILISEGUNDOS PARA CERRAR EL MODAL
            className="modal"
            overlayClassName="modal-fondo"
            ariaHideApp={ !process.env.NODE_ENV === 'test'}
        >
            <h1> { (activeEvent)? 'Editar evento' : 'Nuevo evento' }   </h1>
            <hr />
            <form 
                className="container"
                onSubmit={ handleSubmitForm }    
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange = { handleStartDateChange }
                        value= { dateStart }
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange = { handleEndDateChange }
                        value= { dateEnd }
                        minDate={ dateStart }
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={ `form-control ${ !titleValid && 'is-invalid' }`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={ title }
                        onChange={ handleInputChange }
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value= { notes }
                        onChange={ handleInputChange }

                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
