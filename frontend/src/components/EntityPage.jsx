import {Alert, Box, CircularProgress, Container, Grid, Typography,} from "@mui/material";
import {useEffect, useState} from "react";

export default function EntityPage({loadItems, renderItems, renderForm}) {
    const [data, setData] = useState({
        items: [],
        isLoaded: false,
        error: null,
    });

    const loadData = () => {
        loadItems().then((resp) => {
            setData((prev) => ({
                items: [...resp],
                isLoaded: true,
                error: prev.error,
            }));
        });
    };

    useEffect(() => {
        loadData();
    }, []);

    if (data.error) {
        return <Alert severity="error">{data.error.message}</Alert>;
    } else if (!data.isLoaded) {
        return <CircularProgress/>;
    }

    const itemsToRend = renderItems(data.items);

    console.log(data);
    return (
        <Box height={"100%"}>
            <Grid container columnSpacing={2} pt={"15px"} height={"100%"}>
                <Grid item xs={8} lg={8} height={"100%"}>
                    {/* <Typography variant="h5" component={"h5"}>
            Добавленные
          </Typography> */}
                    {/* <Box display={"flex"} flexDirection={"column"} rowGap={"20px"}> */}

                    <Grid container width={"100%"} height={"100%"} borderRadius={"14px"}>
                        {
                            itemsToRend.length > 0 ? (
                                renderItems(data.items, () => {
                                    loadData()
                                }).map((i) => (
                                    <Grid item xs={6} lg={3} xl={6} key={i}>
                                        {i}
                                    </Grid>
                                ))
                            ) : (
                                <Grid item width={"100%"} height={"100%"} gridRow={"2"}>
                                    <Container>
                                        <Typography variant="h5">Пока что здесь пусто</Typography>
                                    </Container>
                                </Grid>
                            )
                            // data.items.map(i => (<ItemCard item={i} key={i._links.self.href} onEdit={loadData}/>))
                        }
                    </Grid>

                    {/* </Box> */}
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="h5" component={"h5"}>
                        Добавить
                    </Typography>
                    {renderForm(
                        (resp) => {
                            loadData();
                        },
                        (error) => {
                            setData({error: error});
                        }
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
