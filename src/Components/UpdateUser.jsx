import React, { useState, useEffect } from "react";
import {
    Card,
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import AxiosRequest from "./AxiosRequest";
import { toast } from "react-toastify";

const UpdateUser = ({ user }) => {
    const [email, setEmail] = useState(user.email || '');
    const [name, setName] = useState(user.name || '');
    const [image, setImage] = useState(null);
    console.log("data in update user",user);

    useEffect(() => {
        setEmail(user.email);
        setName(user.name);
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handlePress = async () => {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await AxiosRequest.put(`/user/update/${user._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.message === 'User updated successfully') {
                toast.success("Updated successfully");
            }
        } catch (error) {
            toast.error(error.response.data);
        }
    };

    return (
        <Card color="transparent" className="shadow-lg shadow-black p-6" shadow={false}>
            <Typography variant="h4" color="blue-gray">
                Update User
            </Typography>
            <form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
                <div className="mb-1 flex flex-col gap-6">
                    <Input
                        type="text"
                        size="lg"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        size="lg"
                        placeholder="name@mail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                    />
                </div>
                <Button className="mt-6" onClick={handlePress} fullWidth>
                    Update
                </Button>
            </form>
        </Card>
    );
};

export default UpdateUser;
