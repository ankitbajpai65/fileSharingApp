"use client"
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import { AppContext } from "@/app/context/AppContext";
import { Grid, Typography, TextField, Button, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { LoginSchema } from './authSchema';
import './Auth.css';

const BASE_URL = process.env.BASE_URL;

const Login = () => {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { isUserLoggedin, setIsUserLoggedin, setUserData } = useContext(AppContext);

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = async (values) => {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            credentials: "include",
            body: JSON.stringify(values),
        });

        const response = await res.json();
        console.log(response);

        if (response.status === 'ok') {
            setIsUserLoggedin(true)
            setUserData(response.data);
            router.push('/')
        }
        else if (response.status === 'error') {
            setErrorMsg(response.message);
        }
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: LoginSchema,
        onSubmit: handleLoginSubmit
    });

    useEffect(() => {
        if (isUserLoggedin) {
            router.push('/');
        }
    }, [isUserLoggedin]);

    return (
        <Grid container className="formMainContainer">
            <Grid item lg={4} className="formContainer">
                <Typography
                    variant="h4"
                    sx={{ typography: { sm: 'h4', xs: 'h5' }, py: 3 }}
                    className="formHead"
                >
                    Login in your account
                </Typography>
                {['email', 'password'].map((field) => (
                    <TextField
                        key={field}
                        fullWidth
                        placeholder={`Enter ${field}`}
                        id="fullWidth"
                        className="inputField"
                        name={field}
                        type={field === 'password' ? (showPassword ? 'text' : 'password') : 'text'}
                        value={formik.values[field]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[field] && Boolean(formik.errors[field])}
                        helperText={formik.touched[field] && formik.errors[field]}
                        InputProps={field === 'password' && {
                            endAdornment: (
                                <InputAdornment position="end" sx={{ background: 'red' }}>
                                    {showPassword ? (
                                        <Visibility
                                            onClick={handleTogglePasswordVisibility}
                                            fontSize="small"
                                            className="visibilityIcon"
                                        />
                                    ) : (
                                        <VisibilityOff
                                            onClick={handleTogglePasswordVisibility}
                                            fontSize="small"
                                            className="visibilityIcon"
                                        />
                                    )}
                                </InputAdornment>
                            ),
                        }}
                    />
                ))}
                {errorMsg && (
                    <Typography variant="subtitle2" color="error">
                        {errorMsg}
                    </Typography>
                )}
                <Button
                    type="button"
                    variant="contained"
                    className="authBtn"
                    onClick={formik.handleSubmit}
                >
                    Login
                </Button>
                <Typography variant="body2" component="span">
                    Don't have an account?
                    <Button
                        variant="text"
                        sx={{ ml: 1 }}
                        onClick={() => router.push('/signup')}
                    >
                        Signup
                    </Button>
                </Typography>
            </Grid>
        </Grid>

    )
}

export default Login