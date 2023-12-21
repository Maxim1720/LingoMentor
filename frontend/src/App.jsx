import "./App.css";
import {Box, FormControl, InputLabel, MenuItem, Select, Typography,} from "@mui/material";
import {useState} from "react";
import Languages from "./components/language/Languages.jsx";
import TypesPage from "./components/type/TypesPage.jsx";
import TeachersPage from "./components/teacher/TeachersPage.jsx";
import LessonsPage from "./components/lesson/LessonsPage.jsx";

function App() {
    const entities = {
        teachers: "Преподаватели",
        lessons: "Занятия",
        types: "Типы занятий",
        languages: "Языки",
    };
    const components = {
        "": (
            <Box mt={"35vh"} height={"100%"}>
                <Typography
                    className="choose-title"
                    variant="h2"
                    fontFamily={"Sans serif"}
                    textAlign="center"
                >
                    Выберите сущность!
                </Typography>
            </Box>
        ),
        languages: <Languages/>,
        types: <TypesPage/>,
        teachers: <TeachersPage/>,
        lessons: <LessonsPage/>
    };
    const [entity, setEntity] = useState("");

    const handleSelect = (e) => {
        setEntity(e.target.value);
    };

    return (
        <Box width="lg" height={"100%"}>
            <FormControl fullWidth margin="normal">
                <InputLabel id="what-want-to-show">Выберите сущность</InputLabel>
                <Select
                    // style={{width: "250px"}}
                    labelId="what-want-to-show"
                    onChange={handleSelect}
                    value={entity}
                    label="Выберите сущность"
                >
                    {Object.keys(entities).map((k) => (
                        <MenuItem value={k} key={k}>
                            {entities[k]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box mt={"25px"} height={"100%"}>{components[entity]}</Box>
        </Box>
    );
}

export default App;
