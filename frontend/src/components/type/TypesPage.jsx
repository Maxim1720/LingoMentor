import { Alert, Typography } from "@mui/material";
import EntityPage from "../EntityPage";
import ItemCard from "../ItemCard";
import TypeForm from "./TypeForm";
import { useCallback, useEffect, useState } from "react";

export default function TypesPage() {
  const apiUrl = import.meta.env.VITE_API_TYPES;
  const [itemsState, setItemsState] = useState([]);

  const loadItems = useCallback(async () => {
    const resp = await fetch(apiUrl);
    const json = await resp.json();
    // console.log(json);
    return await json._embedded.lessonTypes;
  }, [apiUrl]);

  const updateItemsState = useCallback(() => {
    loadItems().then(items=>setItemsState([...items]));
  }, [loadItems]);  


  useEffect(() => {updateItemsState()}, [updateItemsState]);

  return (
    <EntityPage
      loadItems={async () => itemsState}
      renderItems={(items) => {
        console.log(items);

        const listOfItems = [];

        items.map((i) => {
          listOfItems.push(
            <ItemCard
              item={i}
              key={i._links.self.href}
              onEdit={updateItemsState}
              card={() => {
                return (
                  <Typography>{i.name}</Typography>
                );
              }}
              form={(closeForm) => {
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
                          closeForm();
                          updateItemsState();
                        })
                        .catch((e) => {
                          return <Alert severity={"danger"}>{e.message}</Alert>;
                        });
                    }}
                    initData={i}
                  />
                );
              }}
              onDelete={updateItemsState}
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
                  updateItemsState();
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
