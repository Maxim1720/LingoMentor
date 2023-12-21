import {FormControl} from "@mui/base";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Chip,
    CircularProgress,
    InputLabel,
    Menu,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import EntityPage from "../EntityPage";
import ItemCard from "../ItemCard";
import {Done} from "@mui/icons-material";
import moment from "moment";
import {difficultFromKey, modalStyle} from "../../utils";

const apiUrl = import.meta.env.VITE_API_LESSONS;

const loadLessons = async () => {
    const resp = await fetch(apiUrl);
    const json = await resp.json();
    return json._embedded.lessons;
};

const renderLessons = (lessons, onEdit) => {
    return lessons.map((l) => (
        <ItemCard
            item={l}
            key={l._links.self.href}
            onEdit={() => {
            }}
            form={(onUpdate) => {
                return (
                    <Form
                        onSubmit={async (data) => {
                            const resp = await fetch(l._links.self.href, {
                                method: "PUT",
                                headers: {
                                    "Content-Type": "application/json",
                                    Accept: "application/json",
                                },
                                body: JSON.stringify(data),
                            });
                            const json = await resp.json();
                            l = {...json};
                            onUpdate();
                            return l;
                        }}
                        initData={l}
                    />
                );
            }}
            card={() => {
                const [loaded, setLoaded] = useState(false);
                const [teacher, setTeacher] = useState(null); // Добавляем состояние для преподавателя
                const [language, setLanguage] = useState(null); // Добавляем состояние для языка
                const [type, setType] = useState(null); // Добавляем состояние для типа урока
                const [isOpened, setIsOpened] = useState(false);

                // Асинхронно загружаем данные
                const loadData = async (name, setter) => {
                    const response = await fetch(l._links[name].href);
                    const json = await response.json();
                    setter(json);
                };

                // Загружаем данные для каждой части карточки
                useEffect(() => {
                    Promise.all([
                        loadData("teacher", setTeacher),
                        loadData("language", setLanguage),
                        loadData("lessonType", setType),
                    ]).then((responses) => setLoaded(true));
                }, []); // Запускаем только один раз при монтировании

                return (
                    <>
                        <Card>
                            <CardHeader
                                title={l.name}
                                subheader={
                                    language ? (
                                        <Chip label={language.name} color="info"/>
                                    ) : (
                                        <CircularProgress/>
                                    )
                                }
                            />
                            <CardContent>
                                <Typography>{l.description}</Typography>

                                <Box fullWidth display={"flex"} justifyContent="space-around">
                                    <Chip label={l.duration}/>
                                    <Chip
                                        label={difficultFromKey(l.difficulty)}
                                        color={
                                            l.difficulty === "EASY"
                                                ? "success"
                                                : l.difficulty === "MIDDLE"
                                                    ? "primary"
                                                    : "warning"
                                        }
                                    />

                                    {type ? <Chip label={type.name}/> : <CircularProgress/>}
                                </Box>

                                <Typography>
                                    {moment(l.timestamp).format("HH:mm DD.MM.YY")}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button onClick={() => setIsOpened(true)}>Преподаватель</Button>
                                <Modal open={isOpened} onClose={() => setIsOpened(false)}>
                                    <Box sx={modalStyle}>
                                        {teacher ? (
                                            <>
                                                <Typography
                                                    id="modal-modal-title"
                                                    variant="h6"
                                                    component="h2"
                                                >
                                                    Контакты преподавателя{" "}
                                                    {teacher.firstname + " " + teacher.lastname}
                                                </Typography>
                                                <Typography id="modal-modal-description" sx={{mt: 2}}>
                                                    {teacher.contacts}
                                                </Typography>
                                            </>
                                        ) : (
                                            <CircularProgress/>
                                        )}
                                    </Box>
                                </Modal>
                            </CardActions>
                        </Card>
                    </>
                );
            }}
            onDelete={onEdit}
        ></ItemCard>
    ));
};

export default function LessonsPage() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    // const [filterProps, setFilterProps] = useState({
    //   "difficulty":"",
    // });

    const closeMenu = (e) => {
        setAnchorEl(null);
    }
    return (
        <>
            <Box key={"filter"}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                        setMenuOpen(true);
                        setAnchorEl(e.currentTarget);
                    }}
                    id="filter-btn"
                >
                    <FilterAltIcon/>
                </Button>
                <Menu
                    open={menuOpen}
                    onClose={(e) => {
                        setMenuOpen(false);
                        closeMenu(e);
                    }}
                    anchorEl={anchorEl}
                >
                    <MenuItem key={"1"} onClick={(e) => closeMenu(e)}>Легко</MenuItem>
                    <MenuItem key={"2"}>Средне</MenuItem>
                    <MenuItem key={"3"}>Сложно</MenuItem>
                </Menu>
            </Box>
            <EntityPage
                loadItems={loadLessons}
                renderItems={(lessons, onEdit) => {
                    return renderLessons(lessons, onEdit)
                }}
                renderForm={() => {
                    return (
                        <Form
                            onSubmit={async (data) => {
                                const resp = await fetch(apiUrl, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Accept: "application/json",
                                    },
                                    body: JSON.stringify(data),
                                });
                                return await resp.json();
                            }}
                        />
                    );
                }}
            />
        </>
    );
}

export const Form = ({initData, onSubmit}) => {
    const difficultys = {
        easy: "Легко",
        middle: "Средний",
        hard: "Сложно",
    };

    const [data, setData] = useState({
        ...(initData
            ? {
                ...initData,
                // eslint-disable-next-line react/prop-types
                timestamp: moment(initData.timestamp).format("YYYY-MM-DDTHH:mm"),
            }
            : {
                teacherHref: "",
                lessonTypeHref: "",
                difficulty: "easy",
                duration: "",
                timestamp: moment().format("YYYY-MM-DDTHH:mm"),
                languageHref: "",
                name: "",
                description: "",
            }),
    });

    const [isLoaded, setIsLoaded] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [types, setTypes] = useState([]);

    const loadAllData = useCallback(async () => {
        const responses = Promise.all([
            loadTeachers(),
            loadLanguages(),
            loadTypes(),
        ]);
        return await responses;
    }, []);

    useEffect(() => {
        loadAllData().then((responses) => {
            setTeachers(responses[0]);
            setLanguages(responses[1]);
            setTypes(responses[2]);
            setIsLoaded(true);
            setData((prev) => ({
                ...prev,
                difficulty: prev.difficulty.toLowerCase(),
                teacherHref:
                    prev.teacherHref || responses[0].length
                        ? responses[0][0]._links.self.href
                        : "",
                languageHref:
                    prev.languageHref || responses[1].length
                        ? responses[1][0]._links.self.href
                        : "",
                lessonTypeHref:
                    prev.lessonTypeHref || responses[2].length
                        ? responses[2][0]._links.self.href
                        : "",
            }));
        });
    }, [loadAllData]);

    const formInner = () => {
        return (
            <Box display="flex" flexDirection="column" rowGap={"10px"}>
                <FormControl>
                    <TextField
                        fullWidth
                        width="100%"
                        label={"Наименование"}
                        name="name"
                        onChange={handleChange}
                        type="text"
                        value={data.name}
                        required
                    ></TextField>
                </FormControl>
                <FormControl>
                    <TextField
                        fullWidth
                        label={"Длительность"}
                        type="number"
                        name="duration"
                        onChange={handleChange}
                        value={data.duration}
                        required
                    ></TextField>
                </FormControl>
                <FormControl>
                    <InputLabel id="teacher-label">Преподаватель</InputLabel>
                    <Select
                        fullWidth
                        // labelId="teacher-label"
                        value={data.teacherHref}
                        name="teacherHref"
                        onChange={handleChange}
                        required
                    >
                        {teachers.map((t) => (
                            <MenuItem key={t._links.self.href} value={t._links.self.href}>
                                {t.firstname + " " + t.lastname}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="difficulty-label">Сложность</InputLabel>
                    <Select
                        fullWidth
                        label={"Сложность"}
                        value={data.difficulty}
                        name="difficulty"
                        onChange={(e) => {
                            for (let key in difficultys) {
                                if (difficultys[key] === e.target.value) {
                                    e.target.name = key.toUpperCase();
                                }
                            }
                            handleChange(e);
                        }}
                        required
                    >
                        {Object.keys(difficultys).map((d) => (
                            <MenuItem value={d} key={d}>
                                {difficultys[d]}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel>Язык</InputLabel>
                    <Select
                        fullWidth
                        label={"Язык"}
                        value={data.languageHref}
                        name="languageHref"
                        onChange={handleChange}
                        required
                    >
                        {languages.map((l) => (
                            <MenuItem value={l._links.self.href} key={l._links.self.href}>
                                {l.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <InputLabel id="timestamp">Дата и время начала</InputLabel>
                    <TextField
                        fullWidth
                        // labelId="timestamp"
                        type="datetime-local"
                        value={data.timestamp}
                        name="timestamp"
                        onChange={handleChange}
                    />
                </FormControl>
                <FormControl>
                    <InputLabel>Тип</InputLabel>
                    <Select
                        fullWidth
                        name="lessonTypeHref"
                        onChange={handleChange}
                        label={"Тип занятия"}
                        value={data.lessonTypeHref}
                    >
                        {types.map((t) => (
                            <MenuItem value={t._links.self.href} key={t._links.self.href}>
                                {t.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl>
                    <TextField
                        fullWidth
                        label={"Описание"}
                        type="area"
                        value={data.description}
                        name="description"
                        onChange={handleChange}
                        multiline
                    />
                </FormControl>
                <Button variant="contained" color="success" type="submit">
                    <Done/>
                </Button>
            </Box>
        );
    };

    const handleChange = (e) => {
        setData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                const lessonData = {
                    ...data,
                    difficulty: data.difficulty.toUpperCase(),
                };
                onSubmit(lessonData).then((lesson) => {
                    console.log(lesson);
                    afterSubmit(lesson._links.self.href, data).then((results) =>
                        console.log(results)
                    );
                });
            }}
        >
            {isLoaded ? formInner() : <CircularProgress/>}
        </form>
    );
};

async function afterSubmit(lessonHref, data) {
    console.log(lessonHref);
    console.log(data);

    const patchData = async (propName) => {
        const response = await fetch(lessonHref, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({[propName]: data[propName + "Href"]}),
        });
        return response.json(); // Парсинг JSON из ответа
    };

    const results = await Promise.all([
        await patchData("teacher"),
        await patchData("lessonType"),
        await patchData("language"),
    ]);

    console.log(results);
    return results;
}

async function loadTeachers() {
    return await loadData(import.meta.env.VITE_API_TEACHERS, "teachers");
}

const loadLanguages = async () => {
    return await loadData(import.meta.env.VITE_API_LANGUAGES, "languages");
};

const loadTypes = async () => {
    return await loadData(import.meta.env.VITE_API_TYPES, "lessonTypes");
};

const loadData = async (url, itemsName) => {
    const response = await fetch(url);
    const json = await response.json();
    return json._embedded[itemsName];
};
