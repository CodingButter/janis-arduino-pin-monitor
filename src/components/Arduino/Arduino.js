import { useEffect, useState } from "react";
import { Paper, Grid } from "@material-ui/core";
const start = Date.now();
export default function Arduino({ arduino }) {
  const [pinArray, setPinArray] = useState([]);
  const arduinoStatus = localStorage.getItem("arduino_status") === "true";
  const sendSMS = async (message) => {
    console.log(message);
    /**
     * @TODO create fetch
     * fetch("endpoint",{body:message});
     */
  };
  let currentStatus = pinArray.includes(1);
  if (
    (Date.now() - start > 20000 && Date.now() - start < 45000) ||
    (Date.now() - start > 50000 && Date.now() < 70000)
  )
    currentStatus = false;
  if (arduinoStatus !== currentStatus)
    sendSMS(`${arduino.name} status: ${currentStatus ? "on" : "off"}`);
  localStorage.setItem("arduino_status", currentStatus);

  const fetchData = async () => {
    const endpoint =
      process.env[`REACT_APP_${arduino.name}`] || arduino.endpoint;

    const arduinoResponse = await fetch(endpoint);
    const jsonResponse = await arduinoResponse.json();

    const currentPinArray = jsonResponse.response.values;
    setPinArray(currentPinArray.slice(0, 54));
  };

  useEffect(() => {
    fetchData();
    const fetchInterval = setInterval(() => {
      fetchData();
    }, 15000);

    return () => {
      clearInterval(fetchInterval);
    };
  }, []);

  return (
    <Grid spacing={2} container>
      {pinArray.map((value, pin) => (
        <Grid key={pin} item xs={2} md={1}>
          <Paper>
            <span>Pin {pin + 1}:</span>
            <span>{value}</span>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
