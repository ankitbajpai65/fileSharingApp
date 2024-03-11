"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Grid, Typography, TextField, Button, Snackbar, Alert, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppContext } from "@/app/context/AppContext";
import { useFormik } from 'formik';
import { SignupSchema } from './authSchema';
import './Auth.css';

const BASE_URL = process.env.BASE_URL;

const Signup = () => {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { isUserLoggedin } = useContext(AppContext);

    const [state, setState] = useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = state;

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleAlertClose = () => {
        setState({
            ...state,
            open: false,
        });
    };

    const handleSignupSubmit = async (values, { resetForm }) => {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        const response = await res.json();
        console.log(response);

        if (response.status === 'error') {
            setErrorMsg(response.message);
            return;
        }
        setState((prev) => ({ ...prev, open: true }));
        resetForm();
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: SignupSchema,
        onSubmit: handleSignupSubmit
    });

    useEffect(() => {
        if (isUserLoggedin) {
            router.push('/');
        }
    }, [isUserLoggedin]);

    return (
        <>
            <Grid container className="formMainContainer">
                <Grid item lg={4} className="formContainer">
                    <Typography
                        variant="h4"
                        sx={{ typography: { sm: 'h4', xs: 'h5' }, py: 3 }}
                        className="formHead"
                    >
                        Create your account
                    </Typography>

                    {['name', 'email', 'password'].map((field) => (
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
                        Signup
                    </Button>
                    <Typography variant="body2" component="span">
                        Already have an account?
                        <Button
                            variant="text"
                            sx={{ ml: 1 }}
                            onClick={() => router.push('/login')}
                        >
                            Login
                        </Button>
                    </Typography>
                </Grid>
            </Grid>

            <Snackbar
                open={open}
                anchorOrigin={{ vertical, horizontal }}
                key={vertical + horizontal}
                autoHideDuration={2000}
                onClose={handleAlertClose}>
                <Alert
                    onClose={handleAlertClose}
                    severity="success"
                    sx={{ bgcolor: '#323232', color: 'var(--lightColor)' }}
                >
                    Account created successfully!
                </Alert>
            </Snackbar>
        </>

    )
}

export default Signup;