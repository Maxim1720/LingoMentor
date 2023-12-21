import {Button, FormControl, TextField} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done.js";
import {useEffect, useState} from "react";

export default function TypeForm({initData, onSubmit}) {

    const [data, setData] = useState({
        name: ""
    });
    const handleInput = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
        console.log(data);
    }

    useEffect(() => {
        setData(prev => initData ? initData : prev);
    }, []);

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(data);
        }}>
            <FormControl fullWidth>
                <TextField required id="outlined-basic" value={data.name} label="Название" name="name"
                           onChange={handleInput}/>
            </FormControl>

            <Button type="submit" fullWidth variant={"outlined"}>
                <DoneIcon color="success"/>
            </Button>
        </form>
    );
}