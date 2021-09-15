import { Typography, CssBaseline, Container, AppBar } from "@material-ui/core";
import arduinos from "./arduinos.json";
import Arduino from "./components/Arduino/Arduino";

function App() {
  return (
    <>
      <CssBaseline />
      <AppBar position="sticky">
        <Typography>My Arduinos</Typography>
      </AppBar>
      <Container>
        {arduinos.map((arduino) => (
          <Arduino key={arduino.name} arduino={arduino} />
        ))}
      </Container>
    </>
  );
}

export default App;
