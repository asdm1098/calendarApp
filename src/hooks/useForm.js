import { useState } from "react"

/*
Nuestro useForm recibe un objeto, que tiene las propiedades como un campo de texto,
un selector, o un campo en mi formulario, el cual yo quiero manipular y tambien tengo
el handleInputChange que me va servir a mi para leerlo rapidamente.
*/


export const useForm = ( initialState = {} ) => {
   
    const [values, setValues] = useState(initialState);

    const reset = () => {
        setValues( initialState );
    }

    const handleInputChange = ({ target }) => {
        setValues({
            ...values,
            [ target.name ]: target.value
        });
    }

    return [ values, handleInputChange, reset ];

}