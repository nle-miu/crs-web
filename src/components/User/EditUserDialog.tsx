import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { UserContext } from "../../contexts/UserContext";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { GlobalContext } from "../../contexts/GlobalContext";
import { UserService } from "../../services/user/userService";
import { CustomError } from "../../utils/customError";
import { User } from "../../models/User";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";

const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("Firstname is required"),
    lastname: Yup.string().required("Lastname is required"),
    email: Yup.string()
        .required("Email is required")
        .email("Invalid email address"),
    address: Yup.string().required("Address is required"),
    phone: Yup.string()
        .matches(
            /^\[\d{3}\]-\d{3}-\d{4}$/,
            "Phone is invalid. Please input with format [xxx]-xxx-xxxx"
        )
        .required("Phone is required"),
});

export default function EditUserDialog() {
    const userService = new UserService();
    const { updateLoading, updateNotification } = useContext(GlobalContext);
    const {
        selectedUserId,
        isShowUpdateUserDialog,
        isCompletedEditUser,
        updateIsShowUpdateUserDialog,
        updateIsCompletedEditUser,
    } = useContext(UserContext);

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: {
        firstname: string;
        lastname: string;
        email: string;
        address: string;
        phone: string;
    }): Promise<void> => {
        try {
            updateLoading(true);
            const user: User = {
                userId: selectedUserId,
                username: "",
                password: "",
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                address: data.address,
                phone: data.phone,
            };
            await userService.updateUserById(selectedUserId, user);
            updateLoading(false);
            updateIsShowUpdateUserDialog(false);
            updateIsCompletedEditUser(true);
            updateNotification({
                status: "success",
                message: "Updated user successfully",
            });
        } catch (error) {
            updateLoading(false);
            updateNotification({
                status: "error",
                message:
                    error instanceof CustomError
                        ? error.message
                        : "Unknow message",
            });
        }
    };

    const fetchUserById = async () => {
        try {
            updateLoading(true);
            const user: User = await userService.getUserById(selectedUserId);
            reset({
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                address: user.address,
                phone: user.phone,
            });
            updateLoading(false);
        } catch (error) {
            updateLoading(false);
            updateNotification({
                status: "error",
                message:
                    error instanceof CustomError
                        ? error.message
                        : "Unknow message",
            });
        }
    };

    const handleClose = () => {
        reset();
        updateIsShowUpdateUserDialog(false);
    };

    useEffect(() => {
        fetchUserById();
    }, []);

    return (
        <>
            <Dialog
                open={isShowUpdateUserDialog}
                onClose={handleClose}
                PaperProps={{
                    component: "form",
                    onSubmit: handleSubmit(onSubmit),
                    noValidate: true,
                    autoComplete: "off",
                }}
                sx={{
                    "& .MuiTextField-root": {
                        mt: 1,
                        mb: 1,
                        width: "100%",
                    },
                    mt: 10,
                    maxHeight: 600,
                }}
            >
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <div>
                        <Controller
                            name="firstname"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="First Name"
                                    placeholder="Enter your firstname"
                                    error={errors.firstname ? true : false}
                                    helperText={errors.firstname?.message}
                                />
                            )}
                        />
                        <Controller
                            name="lastname"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Last Name"
                                    placeholder="Enter your lastname"
                                    error={errors.lastname ? true : false}
                                    helperText={errors.lastname?.message}
                                />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Email"
                                    placeholder="Enter your email"
                                    error={errors.email ? true : false}
                                    helperText={errors.email?.message}
                                />
                            )}
                        />
                        <Controller
                            name="address"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Address"
                                    placeholder="Enter your address"
                                    error={errors.address ? true : false}
                                    helperText={errors.address?.message}
                                />
                            )}
                        />
                        <Controller
                            name="phone"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    required
                                    fullWidth
                                    label="Phone"
                                    placeholder="Enter your phone with format [xxx]-xxx-xxxx"
                                    error={errors.phone ? true : false}
                                    helperText={errors.phone?.message}
                                />
                            )}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
