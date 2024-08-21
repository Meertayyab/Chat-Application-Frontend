import React, { useEffect, useState } from "react";
import AxiosRequest from "./AxiosRequest";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogFooter,
    Typography,
    Input,
    Card,
    CardBody,
    CardFooter,
    Spinner,
    CardHeader,
    Avatar,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState({}); 


    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await AxiosRequest.get('/user/all-users');
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleUpdateClick = (user) => {
        setSelectedUser(user);
        setEmail(user.email);
        setName(user.name);
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
        setEmail('');
        setName('');
        setImage(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
    };

    const handleUpdateUser = async () => {
        if (!name || !email) {
            toast.error("Please fill out all required fields");
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }
        setUpdateLoading(true);
        try {
            const response = await AxiosRequest.put(`/user/update/${selectedUser._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            if (response.data.message === 'User updated successfully') {
                toast.success("Updated successfully");
                setUsers(users.map((user) =>
                    user._id === selectedUser._id ? { ...user, email, name, image: URL.createObjectURL(image) } : user
                ));
                handleDialogClose();
            }
        } catch (error) {
            toast.error(error.response.data);
        }finally{
            setUpdateLoading(false);
        }
    };

    const handleDeleteClick = async (user) => {
        if (window.confirm(`Are you sure you want to delete user ${user.name}?`)) {
            setDeleteLoading({ ...deleteLoading, [user._id]: true });
            try {
                const response = await AxiosRequest.delete(`/user/delete/${user._id}`);
                if (response.data.message === 'User deleted successfully') {
                    toast.success("Deleted successfully");
                    setUsers(users.filter((u) => u._id !== user._id));
                }
            } catch (error) {
                toast.error(error.response.data?.message || error.response.data);
            }finally{
                setDeleteLoading({ ...deleteLoading, [user._id]: false });
            }
        }
    }

    const onDelete = (id)=>{
      if(deleteLoading){

      }       
    }

    return (
        <div className="container mx-auto">
            <Typography variant="h4" color="blue-gray" className="text-center my-4">
                User List
            </Typography>
            {loading ? (
                <div className="flex items-center justify-center text-center">
                    <Spinner color="blue" className="text-black h-12 w-12" />
                </div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {users.map((user) => (
                        <motion.div
                            key={user._id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <Card className="shadow-lg">
                                <CardHeader floated={false} shadow={false} className="bg-gray-100">
                                    <Typography variant="h6" color="blue-gray">
                                        {user.name}
                                    </Typography>
                                </CardHeader>
                                <CardBody>
                                    <div className="flex items-center justify-center mb-[2vh]">
                                        <Avatar src={user.image} size="xl" className="object-cover" />
                                    </div>
                                    <Typography color="gray">{user.email}</Typography>
                                </CardBody>
                                <CardFooter className="pt-0 flex flex-col gap-4 items-center justify-center">
                                    <Button color="black" className="hover:shadow-black hover:shadow-md" onClick={() => handleUpdateClick(user)}>
                                        Update
                                    </Button>
                                    <Button color="red"                                         
                                    loading={deleteLoading[user._id]} // Disable button during delete
                                    className="hover:shadow-black hover:shadow-md" onClick={() => handleDeleteClick(user)}>
                                        Delete
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            )}
            <Dialog open={isDialogOpen} handler={handleDialogClose}>
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center"
                >
                    <DialogHeader>Update User</DialogHeader>
                    <Card color="transparent" className="shadow-none p-4 min-w-screen" shadow={false}>
                        <form className="w-full">
                            <div className="flex flex-col gap-3">
                                <Input
                                    type="text"
                                    size="lg"
                                    label="Name"
                                    value={name}
                                    className="focus:ring-0"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <Input
                                    size="lg"
                                    label="Email"
                                    value={email}
                                    className="focus:ring-0"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    type="file"
                                    name="image"
                                    label="Select Image"
                                    className="focus:ring-0"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </form>
                    </Card>
                    <DialogFooter className="flex flex-col gap-2">
                        <Button color="black" loading={updateLoading} className="hover:shadow-black hover:shadow-md" onClick={handleUpdateUser}>
                            Update
                        </Button>
                        <Button color="red" className="hover:shadow-black hover:shadow-md" onClick={handleDialogClose}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </motion.div>
            </Dialog>
        </div>
    );
};

export default UserList;

