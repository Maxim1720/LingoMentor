import {useCallback, useEffect, useState} from "react";
import EntityPage from "../EntityPage";
import ItemCard from "../ItemCard";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import {Done} from "@mui/icons-material";
import {modalStyle} from "../../utils";

const apiUrl = import.meta.env.VITE_API_TEACHERS;

export default function TeachersPage() {
    return (
        <EntityPage
            loadItems={() => {
                return fetch(apiUrl)
                    .then((resp) => resp.json())
                    .then((json) => json._embedded.teachers);
            }}
            renderItems={(items) => {
                const renderedItems = [];
                items.map((i) => {
                    renderedItems.push(
                        <ItemCard
                            key={i._links.self.href}
                            item={i}
                            onEdit={() => {
                            }}
                            form={() => <Form onSubmit={patchData} initData={i}/>}
                            card={() => <TeacherCard item={i}/>}
                        />
                    );
                });
                return renderedItems;
            }}
            renderForm={(onPost, onError) => {
                return (
                    <Form
                        onSubmit={(data) => {
                            postData(data)
                                .then((resp) => {
                                    onPost(resp);
                                })
                                .catch((error) => onError(error));
                        }}
                    />
                );
            }}
        />
    );
}

const postData = (data) => {
    return fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(data),
    });
};

const patchData = (data) => {
    return fetch(data._links.self.href, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
};

const Form = ({initData, onSubmit}) => {
    const [data, setData] = useState({
        // firstname: initData ? initData.firstname : "",
        // lastname: initData ? initData.lastname : "",
        // experience: initData ? initData.experience : "",
        // contacts: initData ? initData.contacts : "",
        ...(initData ? initData : {})
    });

    const handleChange = useCallback((e) => {
        e.preventDefault();
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }, []);

    useEffect(() => {
        console.log(data); // Перенесенная console.log
    }, [data]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(data);
            }}
        >
            <Box display="flex" flexDirection="column" rowGap={"10px"}>
                <FormControl>
                    <TextField
                        label="Имя"
                        name={"firstname"}
                        type={"text"}
                        required
                        value={data.firstname}
                        onChange={(e) => handleChange(e)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Фамилия"
                        name={"lastname"}
                        type={"text"}
                        required
                        value={data.lastname}
                        onChange={(e) => handleChange(e)}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Стаж"
                        name={"experience"}
                        type={"number"}
                        required
                        value={data.experience}
                        onChange={(e) => handleChange(e)}
                        helperText={"в годах"}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Контакты"
                        name={"contacts"}
                        type={"text"}
                        required
                        value={data.contacts}
                        onChange={(e) => handleChange(e)}
                    />
                </FormControl>

                <Button variant="contained" type="submit" color="success">
                    <Done/>
                </Button>
            </Box>
        </form>
    );
};

const TeacherCard = ({item}) => {
    console.log(item);

    const [contactsOpen, setOpen] = useState(false);

    return (
        <Card>
            <CardHeader title={item.firstname + " " + item.lastname}/>
            <CardContent>
                <Typography fontSize={"15px"}>Стаж: {item.experience} лет</Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => setOpen(true)}>Контакты</Button>
                <Modal open={contactsOpen} onClose={() => setOpen(false)}>
                    <Box sx={modalStyle}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Контакты преподавателя {item.firstname + " " + item.lastname}
                        </Typography>
                        <Typography id="modal-modal-description" sx={{mt: 2}}>
                            {item.contacts}
                        </Typography>
                    </Box>
                </Modal>
            </CardActions>
        </Card>
    );
};
