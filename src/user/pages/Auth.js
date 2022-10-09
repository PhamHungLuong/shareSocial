import React from 'react';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../shared/components/UIElement/Card';
import Input from '../../shared/components/FormElement/Input';
import Button from '../../shared/components/FormElement/Button';
import ErrorModal from '../../shared/components/UIElement/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElement/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElement/ImageUpload';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE,
} from '../../shared/ulti/validators';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './Auth.css';

function Auth() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    let navigate = useNavigate();

    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: true,
            },
            password: {
                value: '',
                isValid: true,
            },
        },
        false,
    );

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value,
                    }),
                    {
                        'Content-Type': 'application/json',
                    },
                );

                auth.login(responseData.userId, responseData.token);
                navigate('/');
            } catch (err) {}
        } else {
            const formData = new FormData();
            formData.append('name', formState.inputs.name.value);
            formData.append('email', formState.inputs.email.value);
            formData.append('password', formState.inputs.password.value);
            formData.append('image', formState.inputs.image.value);
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    formData,
                );
                auth.login(responseData.userId, responseData.token);
                navigate('/');
            } catch (err) {}
        }
    };

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    image: undefined,
                },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid,
            );
        } else {
            setFormData(
                {
                    ...formState.inputs,
                    name: {
                        name: '',
                        isValid: false,
                    },
                    image: {
                        value: null,
                        isValid: false,
                    },
                },
                false,
            );
        }
        setIsLoginMode((prevMode) => !prevMode);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay />}
                <h2>Login Required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your Name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name."
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (
                        <ImageUpload
                            center
                            id="image"
                            onInput={inputHandler}
                            errorText="please provide an image"
                        />
                    )}
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="E-mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Pleases enter a valid email address."
                        onInput={inputHandler}
                    />
                    <Input
                        id="password"
                        element="input"
                        type="password"
                        label="Password"
                        errorText="Pleases enter a valid password, at least 6 characters!"
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        onInput={inputHandler}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLoginMode ? 'LOGIN' : 'SIGNUP'}
                </Button>
            </Card>
        </React.Fragment>
    );
}

export default Auth;
