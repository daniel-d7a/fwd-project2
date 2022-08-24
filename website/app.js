/**
 * global variables
 */

const generate = document.getElementById("generate");
const apiKey = "2e62999926c1b9338ec1552c9ac5dee0&units=imperial";
let globalTemp = null;
const date = document.getElementById("date");
const temp = document.getElementById("temp");
const content = document.getElementById("content");
const textArea = document.getElementById("feelings");
const locationToken = "863908c1e2b815";
/**
 * End global variables
 * Start helper functions
 */

async function getNowTemp() {
  const zipCode = zip.value;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zipCode},us&appid=${apiKey}`
  );

  try {
    const temp = await response.json();

    console.log(temp);

    globalTemp = temp.main.temp;
    console.log(globalTemp);
  } catch (error) {
    console.log("error in getTempNow", error);
  }
}

// function locationError() {
//   console.log("couldn't retrieve location");
// }

// function getPosition(resolveParam, rejectParam) {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         resolve(resolveParam(position));
//       },
//       () => {
//         reject(rejectParam());
//       }
//     );
//   });
// }

/**
 * End helper functions
 * Start main functions
 */

async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });

  try {
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error in postData", error);
  }
}

async function getData(url) {
  const response = await fetch(url);

  try {
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error in postData", error);
  }
}
/* 
what happens when we click the button?
- get the temperature of now
- compose a request to send it to the server
- send a post request to send the current entry
- send a get request to get the latest entry
- update the ui 
*/
async function buttonClickHandler() {
  if (!navigator.geolocation) return;

  getNowTemp()
    .then(() => {
      const data = {
        date: `${new Date().getFullYear()} / ${
          new Date().getMonth() + 1
        } / ${new Date().getDate()}`,
        temp: globalTemp,
        content: textArea.value,
      };
      return postData("/postEntry", data);
    })
    .then((postResData) => {
      return getData("/getLatestEntry");
    })
    .then((getResData) => {
      updateUi(getResData);
    });
}

//update the ui
function updateUi(data) {
  textArea.value = "";
  document.getElementById("zip").value = "";

  date.textContent = `Date: ${data.date || "2002 / 2 / 9"}`;
  temp.textContent = `Temperature : ${data.temp || 70}° f`;
  content.textContent = `Content: ${data.content || "Hello World"}`;

  // TODO: fill in the data from the data object you get from the post request
}

/* 
send get req to get data
update ui
*/
function loadInitData() {
  getData("/getLatestEntry").then((data) => {
    updateUi(data);
  });
}
/**
 * End main functions
 * Start execution
 */

/**
 * get the most recent entry on page load
 */

loadInitData();

/**
 * generate on click
 */

generate.addEventListener("click", buttonClickHandler);
