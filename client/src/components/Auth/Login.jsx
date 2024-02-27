"use client"
import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik';
import { AppContext } from "@/app/context/AppContext";
import { Grid, Typography, TextField, Button } from "@mui/material";
import { LoginSchema } from './authSchema';
import './Auth.css';

const BASE_URL = process.env.BASE_URL;

const Login = () => {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");

    const { setIsUserLoggedin, setUserData } = useContext(AppContext);

    const handleLoginSubmit = async (values) => {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            // withCredentials: true,
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

    return (
        <Grid container className="formMainContainer">
            <Grid item xs={11} sm={7} md={5} lg={4} className="formContainer">
                <Typography variant="h4" sx={{ py: 3 }} className="formHead">Login in your account</Typography>
                {['email', 'password'].map((field) => (
                    <TextField
                        key={field}
                        fullWidth
                        placeholder={`Enter ${field}`}
                        id="fullWidth"
                        className="inputField"
                        name={field}
                        value={formik.values[field]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched[field] && Boolean(formik.errors[field])}
                        helperText={formik.touched[field] && formik.errors[field]}
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