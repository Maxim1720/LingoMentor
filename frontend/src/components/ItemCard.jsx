import {useState} from "react";
import {Alert, Button, ButtonGroup, Card, CardActions, CardContent,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Cancel} from "@mui/icons-material";

export default function ItemCard({item, form, card, onDelete}) {
    const [isEditing, setEditing] = useState(false);


    const formView = form(() => {
        setEditing(!isEditing);
    });
    const cardView = card();

    return (
        <Card variant="outlined">
            <CardContent>
                {isEditing ? (
                    <>
                        {formView}
                        <Button fullWidth onClick={() => setEditing(false)}>
                            <Cancel/>
                        </Button>
                    </>
                ) : (
                    // card()
                    cardView
                )}
            </CardContent>
            <CardActions>
                <ButtonGroup fullWidth>
                    {!isEditing ? (
                        <Button
                            onClick={() => {
                                setEditing(!isEditing);
                            }}
                        >
                            <EditIcon/>
                        </Button>
                    ) : (
                        <></>
                    )}

                    <Button
                        disabled={isEditing}
                        color={"error"}
                        onClick={() => {
                            fetch(item._links.self.href, {
                                method: "DELETE",
                                headers: {
                                    accept: "application/json",
                                },
                            })
                                .then(() => {
                                    console.log("deleted");
                                    setEditing(false);
                                    onDelete();
                                })
                                .catch((error) => {
                                    return <Alert severity="error">{error.message}</Alert>;
                                });
                        }}
                    >
                        <DeleteIcon/>
                    </Button>
                </ButtonGroup>
            </CardActions>
        </Card>
    );
}
