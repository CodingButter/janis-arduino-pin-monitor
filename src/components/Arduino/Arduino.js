import { useEffect, useState } from "react";
import { Paper, Grid } from "@material-ui/core";

export default function Arduino({ arduino }) {
  const [pinArray, setPinArray] = useState([]);
  const [lastSent, setLastSent] = useState(Date.now());
  const sendSMS = async (message) => {
    const hoursPast = (Date.now() - lastSent) / 1000 / 60 / 60;
    console.log({
      hoursPast,
      arduioTime: arduino.warningTime,
    });
    if (hoursPast < arduino.warningTime) return;
    setLastSent(Date.now());
    console.log(message);
    /**
     * @TODO create fetch
     * fetch("endpoint",{body:message});
     */
  };

  const comparePins = (previous, current) => {
    var message = `${arduino.name} has a pin problem\n`;
    var shouldSend = false;
    previous.forEach((value, index) => {
      const pinRules = arduino.rules[`p${index + 1}`];
      if (pinRules) {
        pinRules.forEach((pinRule) => {
          switch (pinRule.condition) {
            case ">":
              if (current[index] > pinRule.value) {
                message += `${pinRule.message}\n`;
                shouldSend = true;
              }
              break;
            case "<":
              if (current[index] < pinRule.value) {
                message += `${pinRule.message}\n`;
                shouldSend = true;
              }
              break;
            case "=":
              if (current[index] === pinRule.value) {
                message += `${pinRule.message}\n`;
                shouldSend = true;
              }
              break;

            default:
              break;
          }
        });
      } else {
        if (index < 55 && current[index] !== value) shouldSend = true;
      }
    });
    if (!shouldSend) return;
    sendSMS(message);
  };

  const fetchData = async () => {
    const endpoint = process.env[`REACT_APP_${arduino.name}`];
    const arduinoResponse = await fetch(endpoint);
    const jsonResponse = await arduinoResponse.json();

    const currentPinArray = jsonResponse.response.values;

    setPinArray((previousPinArray) => {
      comparePins(previousPinArray, currentPinArray);
      return currentPinArray;
    });
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
