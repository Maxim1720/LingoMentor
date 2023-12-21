import {useState} from "react";
import {Alert, Box, Button, ButtonGroup, Card, CardContent, Typography} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LanguageForm from "./LanguageForm.jsx";
import {Cancel} from "@mui/icons-material";

export default function LanguageCard({language, onEdit}) {

    const [isEditing, setEditing] = useState(false);

    const form = () => {
        console.log(language);
        return (
            <>
                <LanguageForm initData={language} onSubmit={(data) => {
                    fetch(data._links.self.href, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },
                        body: JSON.stringify(data)
                    })
                        .then(resp => resp.json())
                        .then(resp => {
                            console.log(resp);
                            setEditing(!isEditing);
                            onEdit();
                        })
                        .catch(e => {
                            return (
                                <Alert severity={"danger"}>
                                    {e.message}
                                </Alert>
                            )
                        })
                }}/>
                <Button fullWidth onClick={()=>setEditing(false)}><Cancel/></Button>
            </>

        );
    }
    const card = () => {
        return (
            <Typography>{language.name}</Typography>
        );
    }

    return (
        <Box>
            {isEditing ? form() : card()}
            <ButtonGroup fullWidth>
                {!isEditing
                    ?
                    <Button onClick={() => {
                        setEditing(!isEditing);
                    }}>
                        <EditIcon/>
                    </Button>
                    : <></>
                }

                <Button disabled={isEditing} color={"error"} onClick={()=>{
                    fetch(language._links.self.href, {
                        method: "DELETE",
                        headers:{
                            "accept":"application/json"
                        }
                    }).then(()=>{
                        setEditing(false);
                        onEdit();
                    })
                        .catch(error=>{
                            return (
                                <Alert severity="error">
                                    {error.message}
                                </Alert>
                            );
                        })
                }}>
                    <DeleteIcon></DeleteIcon>
                </Button>
            </ButtonGroup>
        </Box>
    );

}