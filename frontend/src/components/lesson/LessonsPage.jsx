import { FormControl, resolveComponentProps } from "@mui/base";
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
import { useCallback, useEffect, useState } from "react";
import EntityPage from "../EntityPage";
import ItemCard from "../ItemCard";
import { Done } from "@mui/icons-material";
import moment from "moment";
import { difficultFromKey, modalStyle } from "../../utils";

const API_URL = import.meta.env.VITE_API_LESSONS;

const LessonCard = ({ item }) => {
  const [loaded, setLoaded] = useState(false);
  const [teacher, setTeacher] = useState(null); // Добавляем состояние для преподавателя
  const [language, setLanguage] = useState(null); // Добавляем состояние для языка
  const [type, setType] = useState(null); // Добавляем состояние для типа урока
  const [isOpened, setIsOpened] = useState(false);

  // Асинхронно загружаем данные
  const loadData = useCallback(
    async (name, setter) => {
      const response = await fetch(item._links[name].href);
      const json = await response.json();
      setter(json);
    },
    [item]
  );

  // Загружаем данные для каждой части карточки
  useEffect(() => {
    Promise.all([
      loadData("teacher", setTeacher),
      loadData("language", setLanguage),
      loadData("lessonType", setType),
    ]).then(() => setLoaded(true));
  }, []); // Запускаем только один раз при монтировании

  return (
    <>
      <Card>
        <CardHeader
          title={item.name}
          subheader={
            language ? (
              <Chip label={language.name} color="info" />
            ) : (
              <CircularProgress />
            )
          }
        />
        <CardContent>
          <Typography>{item.description}</Typography>

          <Box width={"100%"} display={"flex"} justifyContent="space-around">
            <Chip label={item.duration} />
            <Chip
              label={difficultFromKey(item.difficulty)}
              color={
                item.difficulty === "EASY"
                  ? "success"
                  : item.difficulty === "MIDDLE"
                  ? "primary"
                  : "warning"
              }
            />

            {type ? <Chip label={type.name} /> : <CircularProgress />}
          </Box>

          <Typography>
            {moment(item.timestamp).utc().format("HH:m DD.MM.YY")}
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
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    {teacher.contacts}
                  </Typography>
                </>
              ) : (
                <Box>
                  <CircularProgress />
                </Box>
              )}
            </Box>
          </Modal>
        </CardActions>
      </Card>
    </>
  );
};

export default function LessonsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [lessons, setLessonsState] = useState([]);

  const loadLessonsFromApi = useCallback(async () => {
    const resp = await fetch(API_URL);
    const json = await resp.json();
    return json._embedded.lessons;
  }, []);

  const updateLessonsState = useCallback(() => {
    loadLessonsFromApi().then((lessons) => setLessonsState([...lessons]));
  }, [loadLessonsFromApi]);

  useEffect(() => {
    updateLessonsState();
  }, [updateLessonsState]);

  const closeMenu = (e) => {
    setAnchorEl(null);
  };

  const renderLessons = (lessons) => {
    return lessons.map((l) => (
      <ItemCard
        item={l}
        key={l._links.self.href}
        form={(closeForm) => {
          return (
            <Form
              onSubmit={async (data) => {
                const dataForUpdate = { 
                  ...data,
                  language: data.languageHref,
                  lessonType: data.lessonTypeHref,
                  teacher: data.teacherHref
                };
                console.log(dataForUpdate);

                fetch(l._links.self.href, {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                  body: JSON.stringify(dataForUpdate),
                })
                  .then((resp) => resp.json())
                  .then((json) => {
                    console.log("updated lesson!");
                    l = { ...json };
                  })
                  .then(()=>closeForm())
                  .then(() => updateLessonsState());
              }}
              initData={l}
            />
          );
        }}
        card={() => <LessonCard item={l} />}
        onDelete={updateLessonsState}
      ></ItemCard>
    ));
  };

  const lessonsForm = (onPost, onError) => {
    return (
      <Form
        onSubmit={async (data) => {
          fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(data),
          })
            .then((resp) => resp.json())
            .then(async (lesson) => {
              const results = await afterSubmit(lesson._links.self.href, data);
              console.log(results);
              return results;
            })
            .then(() => {
              updateLessonsState();
              //   onPost();
            })
            .catch((error) => {
              onError(error);
            });
        }}
      />
    );
  };

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
          <FilterAltIcon />
        </Button>
        <Menu
          open={menuOpen}
          onClose={(e) => {
            setMenuOpen(false);
            closeMenu(e);
          }}
          anchorEl={anchorEl}
        >
          <MenuItem key={"1"} onClick={(e) => closeMenu(e)}>
            Легко
          </MenuItem>
          <MenuItem key={"2"}>Средне</MenuItem>
          <MenuItem key={"3"}>Сложно</MenuItem>
        </Menu>
      </Box>

      <EntityPage
        loadItems={async () => lessons}
        renderItems={renderLessons}
        renderForm={lessonsForm}
      />
    </>
  );
}

export const Form = ({ initData, onSubmit }) => {
  const difficultys = {
    easy: "Легко",
    middle: "Средний",
    hard: "Сложно",
  };

  const [data, setData] = useState({
    ...(initData
      ? {
          ...initData,
          timestamp: moment(initData.timestamp).format("YYYY-MM-DDTHH:mm"),
          difficulty: initData.difficulty,
        }
      : {
          teacherHref: "",
          lessonTypeHref: "",
          difficulty: Object.keys(difficultys)[0],
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

    console.log("date time = ");
    
    const loadRef = async (link) => {
      const response = await fetch(link);
      const json = await response.json();
      return json;
    };

    if (initData) {
      const refs = ["lessonType", "language", "teacher"];
      const responses = Promise.all(
        refs.map(async (r) => {
          const result = await loadRef(initData._links[r].href);
          return result;
        })
      );

      responses
        .then((results) => {
          setData({
            ...initData,
            timestamp: moment(initData.timestamp).format("YYYY-MM-DDTHH:mm"),
            languageHref: results[1]._links.self.href,
            lessonTypeHref: results[0]._links.self.href,
            teacherHref: results[2]._links.self.href,
          });
        })
        .then(() => {
          setIsLoaded(true);
        });
    }
  }, [initData]);

  useEffect(() => {
    loadAllData().then((responses) => {
      setTeachers(responses[0]);
      setLanguages(responses[1]);
      setTypes(responses[2]);

      console.log(responses[0]);

      if (!initData) {
        setData((prev) => ({
          ...prev,
          teacherHref: prev.teacherHref
            ? prev.teacherHref
            : responses[0].length
            ? responses[0][0]._links.self.href
            : "",
          languageHref:
            prev.languageHref || responses[1].length
              ? responses[1][0]._links.self.href
              : "",
          lessonTypeHref: prev.lessonTypeHref
            ? prev.lessonTypeHref
            : responses[2].length
            ? responses[2][0]._links.self.href
            : "",
        }));
        setIsLoaded(true);
      }
    });
  }, [initData, loadAllData]);

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
            value={data.difficulty.toLowerCase()}
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
          <Done />
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
        // onSubmit(lessonData).then((lesson) => {
        //   console.log(lesson);
        //   afterSubmit(lesson._links.self.href, data).then((results) =>
        //     console.log(results)
        //   );
        // });
        onSubmit(lessonData);
      }}
    >
      {isLoaded ? formInner() : <CircularProgress />}
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
      body: JSON.stringify({ [propName]: data[propName + "Href"] }),
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
