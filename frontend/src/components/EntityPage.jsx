import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

export default function EntityPage({ loadItems, renderItems, renderForm }) {
  const [data, setData] = useState({
    items: [],
    isLoaded: false,
    error: null,
  });

  const loadData = useCallback(() => {
    loadItems().then((resp) => {
      setData((prev) => ({
        items: [...resp],
        isLoaded: true,
        error: prev.error,
      }));
    });
  }, [loadItems]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (data.error) {
    return <Alert severity="error">{data.error.message}</Alert>;
  } else if (!data.isLoaded) {
    return <CircularProgress />;
  }

  const renderedItems = renderItems(data.items);
  console.log(renderedItems);

  console.log(data);
  return (
    <Box height={"100%"}>
      <Grid container columnSpacing={2} pt={"15px"} height={"100%"}>
        <Grid item xs={8} lg={8} height={"100%"}>
          <Grid container width={"100%"} height={"100%"} borderRadius={"14px"}>
            {renderedItems.length > 0 ? (
              renderedItems.map((i) => (
                <Grid item xs={6} lg={4} xl={6} key={i.key}>
                  {i}
                </Grid>
              ))
            ) : (
              <Grid item width={"100%"} height={"100%"} gridRow={"2"}>
                <Container>
                  <Typography variant="h5">Пока что здесь пусто</Typography>
                </Container>
              </Grid>
            )}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5" component={"h5"}>
            Добавить
          </Typography>
          {renderForm(
            ()=>{console.log("posted!"); loadData()},
            (error) => {
              setData({ error: error });
            }
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
