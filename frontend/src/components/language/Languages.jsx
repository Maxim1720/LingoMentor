import {Alert, Typography,} from "@mui/material";
import LanguageForm from "./LanguageForm.jsx";
import EntityPage from "../EntityPage.jsx";
import ItemCard from "../ItemCard.jsx";
import { useCallback, useEffect, useState } from "react";

export default function Languages() {

    const [itemsState, setItemsState] = useState([]);
    
    const loadItems = useCallback(async () => {
        const resp = await fetch(import.meta.env.VITE_API_LANGUAGES);
        const json = await resp.json();
        return json._embedded.languages;
    }, []);

    const updateItems = useCallback(()=>{
        loadItems().then(items=>setItemsState(items));
    }, [loadItems]);

    useEffect(()=>{
        updateItems();
    }, [updateItems]);


    return (
        <EntityPage
            loadItems={async ()=>itemsState}
            renderItems={(items) => {
                const listOfItems = [];
                // const onEdit = () => loadItems().then((res) => (items = res));
                items.map((i) => {
                    listOfItems.push(
                        <ItemCard
                            item={i}
                            key={i._links.self.href}
                            onEdit={updateItems}
                            card={() => {
                                return (
                                    <Typography>{i.name}</Typography>
                                );
                            }}
                            onDelete={updateItems}
                            form={(closeForm) => {
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
                                                    updateItems();
                                                    closeForm();
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
            renderForm={(onPost, onError) => {
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
                                updateItems();
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
