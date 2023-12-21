import { Alert, Card, CardContent, CardHeader, Typography } from "@mui/material";
import EntityPage from "../EntityPage";
import ItemCard from "../ItemCard";
import TypeForm from "./TypeForm";

export default function TypesPage() {
  const apiUrl = import.meta.env.VITE_API_TYPES;

  const loadItems = async () => {
    const resp = await fetch(apiUrl);
    const json = await resp.json();
    // console.log(json);
    return await json._embedded.lessonTypes;
  };

  return (
    <EntityPage
      loadItems={loadItems}
      renderItems={(items) => {
        console.log(items);

        const listOfItems = [];

        items.map((i) => {
          listOfItems.push(
            <ItemCard
              item={i}
              key={i._links.self.href}
              onEdit={() => (items = loadItems())}
              card={() => {
                return (
                  <Typography>{i.name}</Typography>
                  // <Card>
                  //   <CardHeader title={i.name}/>
                  // </Card>
                );
              }}
              form={({ onEdit }) => {
                console.log("form now");
                return (
                  <TypeForm
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
                          // setEditing(!isEditing);
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
      renderForm={(onSubmit, onError) => {
        return (
          <TypeForm
            onSubmit={(data) => {
              fetch(import.meta.env.VITE_API_TYPES, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
              })
                .then((resp) => {
                  console.log(resp);
                  //   loadItems();
                  onSubmit(resp);
                })
                .catch((error) => {
                  //   setData({ error: error });
                  onError(error);
                });
            }}
          />
        );
      }}
    />
  );
}
