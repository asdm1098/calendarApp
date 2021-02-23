import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';


import { Navbar } from '../ui/Navbar';
import { uiOPenModal } from '../../actions/ui';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { messages } from '../../helpers/calendar-messages-es';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { eventClearActiveEvent, eventSetActive, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');

const localizer = momentLocalizer(moment); // or globalizeLocalizer


export const CalendarScreen = () => {

    const dispatch = useDispatch();
    const { events, activeEvent } = useSelector(state => state.calendar);
    const { uid } = useSelector ( state => state.auth );

    const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'month' );

    useEffect(() => {
        
        dispatch( eventStartLoading() );

    }, [dispatch])

    //Acción dobleClick, Abrir modal -uiActions.
    const onDoubleClick = (e) => {
        //console.log(e);
        //openModal
        dispatch( uiOPenModal() );
    }

    const onSelectEvent = (e) => {
        //console.log(e);
        dispatch( eventSetActive(e) ); //envia el evento acitvo a nuestro store
    }

    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    //al seleccionar un campo en blanco, llama un evento.
    const onSelectSlot = (e) => {
        //console.log(e);
        dispatch( eventClearActiveEvent() );
    }

    const eventStyleGetter = ( event, start, end, isSelected ) => {

        //console.log(event);

        const style = {
            backgroundColor: ( uid === event.user._id  ) ? '#367CF7' : '#465660',
            bordeRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }


        return {
            style
        }
    }

    return (
        <div className="calendar-screen">
            <Navbar />

            <Calendar
                localizer={localizer}
                events={ events }
                startAccessor="start"
                endAccessor="end"
                messages = { messages }
                eventPropGetter = { eventStyleGetter }
                onDoubleClickEvent = { onDoubleClick }
                onSelectEvent = { onSelectEvent }
                onView = { onViewChange }
                view = { lastView }
                onSelectSlot = { onSelectSlot }
                selectable= { true }
                components = {{
                    event: CalendarEvent
                }}
            />

            <AddNewFab />
            {
                ( activeEvent ) && <DeleteEventFab />
            }

            <CalendarModal />
        </div>
    )
}
