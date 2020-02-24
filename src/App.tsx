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
import Modal from "@material-ui/core/Modal";

const useStyles = makeStyles({
  card: {
    height: 300,
    margin: "auto"
  },
  media: {
    height: "100%",
    width: "100%",
    margin: "0 auto",
    "&:hover": {
      cursor: "pointer"
    }
  },
  formControl: {
    minWidth: 340,
    marginTop: 16
  },
  container: {
    paddingTop: 24,
    marginBottom: 16,
    textAlign: "center",
    width: "100%",
    height: "100%"
  },
  breedSectionHeader: {
    marginBottom: 16,
    textTransform: "capitalize"
  },
  sectionDivider: {
    marginBottom: 16
  },
  modal: {
    margin: "auto",
    "& > img": {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "90vw",
      maxHeight: "90vh",
      outline: "none"
    }
  }
});

function App() {
  const [breeds, setBreeds] = useLocalStorage("breeds", []);
  const [images, setImages] = useLocalStorage("images", {});
  const [showModalImage, setShowModalImage] = useState("");
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
      if (breeds.length && !Object.keys(images).length) {
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

  const handleOpenModal = (imageSrc: string) => {
    setShowModalImage(imageSrc);
  };

  const handleCloseModal = () => {
    setShowModalImage("");
  };

  return (
    <Container className={classes.container}>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h4">Find pictures of good doggos!</Typography>
        </Grid>
        <Grid item>
          <FormControl className={classes.formControl}>
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
      {!!filterValues.length && !!Object.keys(images).length && (
        <Grid
          container
          justify="center"
          alignItems="center"
          direction="column"
          data-testid="doggo-image-container"
        >
          {filterValues.map((breed, i) => (
            <Box mt={3} width="100%">
              {i !== 0 && <Divider className={classes.sectionDivider} />}
              <Typography variant="h5" className={classes.breedSectionHeader}>
                {breed}s
              </Typography>
              <Grid container spacing={2} justify="center" alignItems="center">
                {images[breed].map((imageSrc: string) => {
                  return (
                    <Grid item key={imageSrc} xs={12} sm={3}>
                      <Card className={classes.card}>
                        <CardMedia
                          className={classes.media}
                          image={imageSrc}
                          onClick={() => handleOpenModal(imageSrc)}
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
      {!!showModalImage && (
        <Modal open onClose={handleCloseModal} className={classes.modal}>
          <img alt={showModalImage} src={showModalImage} />
        </Modal>
      )}
    </Container>
  );
}

export default App;
