import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import LanguageForm from "./LanguageForm.jsx";
import EntityPage from "../EntityPage.jsx";
import ItemCard from "../ItemCard.jsx";
import { Cancel } from "@mui/icons-material";

export default function Languages() {
  // const [data, setData] = useState({
  //   items: [],
  //   isLoaded: false,
  //   error: null,
  // });

  // const loadData = () => {
  //   fetch(import.meta.env.VITE_API_LANGUAGES)
  //     .then((resp) => resp.json())
  //     .then((resp) =>
  //       setData({
  //         items: [...resp._embedded.languages],
  //         isLoaded: true,
  //         error: null,
  //       })
  //     )
  //     .catch((error) => {
  //       setData({
  //         error: error,
  //       });
  //     });
  // };
  // useEffect(() => {
  //   loadData();
  // }, []);

  // if (data.error) {
  //   return <Alert severity="error">{data.error.message}</Alert>;
  // } else if (!data.isLoaded) {
  //   return <CircularProgress />;
  // }

  // return (
  //   <Container maxWidth={"lg"}>
  //     <Grid container spacing={2} pt={"15px"}>
  //       <Grid item xs={8}>
  //         <Typography variant="h5" component={"h5"}>
  //           Добавленные языки
  //         </Typography>
  //         {data.items.map((i) => (
  //           <LanguageCard
  //             language={i}
  //             key={i._links.self.href}
  //             onEdit={loadData}
  //           />
  //         ))}
  //       </Grid>
  //       <Grid item xs={4}>
  //         {/*<h2>Добавьте язык!</h2>*/}
  //         <FormControl fullWidth>
  //           <Typography variant="h5" component={"h5"}>
  //             Добавьте язык
  //           </Typography>
  //           <LanguageForm
  //             onSubmit={(data) => {
  //               fetch(import.meta.env.VITE_API_LANGUAGES, {
  //                 method: "POST",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify(data),
  //               })
  //                 .then((resp) => {
  //                   console.log(resp);
  //                   loadData();
  //                 })
  //                 .catch((error) => {
  //                   setData({ error: error });
  //                 });
  //             }}
  //           />
  //         </FormControl>
  //       </Grid>
  //     </Grid>
  //   </Container>
  // );

  const loadItems = () => {
    // const resp = await fetch(import.meta.env.VITE_API_LANGUAGES);
    // const json = await resp.json();
    // console.log(json);
    // return json._embedded.languages;
    return fetch(import.meta.env.VITE_API_LANGUAGES)
      .then((resp) => resp.json())
      .then((json) => json._embedded.languages);
  };

  return (
    <EntityPage
      loadItems={loadItems}
      renderItems={(items) => {
        const listOfItems = [];
        const onEdit = () => loadItems().then((res) => (items = res));
        items.map((i) => {
          listOfItems.push(
            <ItemCard
              item={i}
              key={i._links.self.href}
              onEdit={onEdit()}
              card={() => {
                return (
                  <Typography>{i.name}</Typography>
                );
              }}
              form={() => {
                console.log("form now");
                return (
                  <LanguageForm
                    onSubmit={(data) => {
                      fetch(data._links.self.href, {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json",
                        },
                        body: JSON.stringify(data),
                      })
                        .then((resp) => resp.json())
                        .then((resp) => {
                          console.log(resp);
                          onEdit();
                        })
                        .catch((e) => {
                          return <Alert severity={"danger"}>{e.message}</Alert>;
                        });
                    }}
                    initData={i}
                  />
                );
              }}
            />
          );
        });

        return listOfItems;
      }}
      renderForm={(onPost, onError)=>{
        return (<LanguageForm
                      onSubmit={(data) => {
                        fetch(import.meta.env.VITE_API_LANGUAGES, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(data),
                        })
                          .then((resp) => {
                            console.log(resp);
                            onPost(resp);
                          })
                          .catch((error) => {
                            onError(error);
                          });
                      }}
                    />);
      }}
    />
  );
}
