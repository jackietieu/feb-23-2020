import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import useLocalStorage from "./hooks/useLocalStorage";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import CardMedia from "@material-ui/core/CardMedia";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grey from "@material-ui/core/colors/grey";

const useStyles = makeStyles({
  card: {
    height: 300,
    margin: "auto"
  },
  media: {
    height: "100%",
    width: "100%",
    margin: "0 auto"
  },
  formControl: {
    minWidth: 340,
    marginTop: 16
  },
  container: {
    paddingTop: 24,
    marginBottom: 16,
    textAlign: "center",
    backgroundColor: Grey[50]
  },
  breedSectionHeader: {
    marginBottom: 16,
    textTransform: "capitalize"
  },
  sectionDivider: {
    marginBottom: 16
  }
});

function App() {
  const [breeds, setBreeds] = useLocalStorage("breeds", []);
  const [images, setImages] = useLocalStorage("images", {});
  const [filterValues, setFilterValues] = useState<string[]>([]);
  const classes = useStyles();

  useEffect(() => {
    (async function fetchData() {
      if (!breeds.length) {
        await fetch("https://dog.ceo/api/breeds/list/all")
          .then(res => res.json())
          .then(res => {
            setBreeds(Object.keys(res.message));
          })
          .catch(e => console.error(e || e.message));
      }
    })();
  }, []);

  useEffect(() => {
    (async function fetchData() {
      if (breeds.length && !!Object.keys(images).length) {
        const promises = breeds.map((breed: string) =>
          fetch(`https://dog.ceo/api/breed/${breed}/images`)
        );
        await Promise.all(promises)
          .then(
            async (results: any[]) =>
              await Promise.all(
                results.map(result => result.json())
              ).then(jsonResults => jsonResults.map(res => res.message))
          )
          .then(results => {
            const newImages: Record<string, string[]> = {};
            results.forEach((result, i) => {
              newImages[breeds[i]] = result;
            });
            setImages(newImages);
          })
          .catch(e => console.error(e || e.message));
      }
    })();
  }, [breeds]);

  const handleChange = (event: any) => {
    setFilterValues(event?.target?.value);
  };

  return (
    <Container classes={{ root: classes.container }}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4">Find pictures of good doggos!</Typography>
        </Grid>
        <Grid item>
          <FormControl classes={{ root: classes.formControl }}>
            <InputLabel id="multiple-breeds-filter">Select Breeds</InputLabel>
            <Select
              labelId="multiple-breeds-filter"
              id="multiple-breeds-filter-select"
              multiple
              value={filterValues}
              onChange={handleChange}
            >
              {breeds.map((breed: string) => (
                <MenuItem key={breed} value={breed}>
                  {breed}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {!!filterValues.length && (
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          data-testid="doggo-image-container"
        >
          {filterValues.map((breed, i) => (
            <Box mt={3} width="100%">
              {i !== 0 && (
                <Divider classes={{ root: classes.sectionDivider }} />
              )}
              <Typography
                variant="h5"
                classes={{ root: classes.breedSectionHeader }}
              >
                {breed}s
              </Typography>
              <Grid container spacing={2} justify="center" alignItems="center">
                {images[breed].map((imageSrc: string) => {
                  return (
                    <Grid item key={imageSrc} xs={12} sm={3}>
                      <Card classes={{ root: classes.card }}>
                        <CardMedia
                          classes={{ root: classes.media }}
                          image={imageSrc}
                        />
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default App;
