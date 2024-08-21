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

const Register = () => {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log('Sending from frontend',file);
        setImage(file);
    };

    const handlePress = async () => {
        if (!name) {
            toast.error("Please enter your name");
            return;
        }
        if (!email) {
            toast.error("Please enter your email");
            return;
        }
        if (!password) {
            toast.error("Please enter your password");
            return;
        }
        if (!image) {
            toast.error("Please select an image");
            return;
        }
        const Form = new FormData();
        Form.append('email', email);
        Form.append('password', password);
        Form.append('name', name);
        Form.append('image', image);
        setLoading(true);
        try {
            const response = await AxiosRequest.post('/user/register',Form,{
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            if (response.data.message === 'Success registration') {
                toast.success("Registered successfully");
                navigate('/login');
            }
        } catch (error) {
            if(error.response.data.error === 'Email already exists'){
                toast.error("Email already exists");
            }
                toast.error(error.response.data);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <Card color="transparent" className="shadow-lg shadow-black p-6" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                    Register
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                    Nice to meet you! Register your account.
                </Typography>
                <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                    <div className="mb-1 flex flex-col gap-6">
                    <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Name
                        </Typography>
                        <Input
                            type="text"
                            size="lg"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
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
                         <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Image
                        </Typography>
                        <Input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>
                    <Checkbox
                        label={
                            <Typography
                                variant="small"
                                color="gray"
                                className="flex items-center font-normal"
                            >
                                I agree to the
                                <a
                                    href="#"
                                    className="font-medium transition-colors hover:text-gray-900"
                                >
                                    &nbsp;Terms and Conditions
                                </a>
                            </Typography>
                        }
                        containerProps={{ className: "-ml-2.5" }}
                    />
                        <div className="!flex !items-center !text-center  !justify-center">
                    <Button className="mt-6 hover:shadow-black hover:shadow-md" loading={loading}  onClick={handlePress}>
                        Register
                    </Button>
                    </div>
                    <Typography color="gray" className="mt-4 text-center font-normal">
                        Already have an account?{" "}
                        <a href="/login" className="font-medium hover:text-gray-900 text-blue-600">
                            Login In
                        </a>
                    </Typography>
                </form>
            </Card>
        </div>
    );
}

export default Register;
