import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../shared/components/FormElement/Button';
import Input from '../../shared/components/FormElement/Input';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH,
} from '../../shared/ulti/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';
import './PlaceForm.css';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false,
            },
            description: {
                value: '',
                isValid: false,
            },
            address: {
                value: '',
                isValid: false,
            },
            image: {
                value: '',
                isValid: false,
            },
        },
        false,
    );

    let navigate = useNavigate();

    const placeSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const fromData = new FormData();
            fromData.append('title', formState.inputs.title.value);
            fromData.append('description', formState.inputs.description.value);
            fromData.append('address', formState.inputs.address.value);
            fromData.append('image', formState.inputs.image.value);
            await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                fromData,
                {
                    Authorization: 'Bearer ' + auth.token,
                },
            );
            navigate('/');
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                />
                <Input
                    id="description"
                    element="textarea"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                />
                <Input
                    id="address"
                    element="input"
                    label="address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address"
                    onInput={inputHandler}
                />
                <ImageUpload
                    id="image"
                    onInput={inputHandler}
                    errorText="please provide an image"
                />
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
