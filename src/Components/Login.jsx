import {
    Card,
    Input,
    Checkbox,
    Button,
    Typography,
  } from "@material-tailwind/react";
import React, { useState } from "react";
import AxiosRequest from "./AxiosRequest";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handlePress = async () => {
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        if (!password) {
            toast.error("Please enter your password");
            return;
        }
        try {
            const response = await AxiosRequest.post('/user/login', {
                email,
                password
            });
            if (response.data.msg === 'ok') {
                toast.success("Logged in successfully");
                localStorage.setItem('token', response.data.token);
                console.log('Token received in login',response.data.token);
                navigate('/home');
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                if (error.response.data.error === 'User not found') {
                    toast.error("Account not found");
                } else if (error.response.data.error === 'Invalid Credentials') {
                    toast.error("Invalid credentials");
                } else {
                    toast.error(error.response.data.error || 'Failed to login');
                }
            } else {
                toast.error('Failed to login');
            }
        }
    };

    return (
        <div className="flex flex-col items-center">
            <Card color="transparent" className="shadow-lg shadow-black p-6" shadow={false}>
                <Typography variant="h4" color="blue-gray">
                    Login
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Nice to meet you! Login to your account.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Email
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Password
                        </Typography>
                        <Input
                            type="password"
                            size="lg"
                            placeholder="********"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <Button className="mt-6 hover:shadow-black hover:shadow-md"  onClick={handlePress} minWidth>
                        Log In
                    </Button>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Don't have an account?{" "}
                        <a href="/register" className="font-medium hover:text-gray-900 text-blue-600">
                            Register
                        </a>
                    </Typography>
                </form>
            </Card>
        </div>
    );
}

export default Login;
