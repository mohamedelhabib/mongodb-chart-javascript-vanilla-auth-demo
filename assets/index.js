const ChartsEmbedSDK = window.ChartsEmbedSDK;

const client = stitch.Stitch.initializeAppClient(
  APP_ID, // Realm App ID
);
// const app = new Realm.App({ id: APP_ID });

function getUser() {
  return document.getElementById("username").value;
}

function getPass() {
  return document.getElementById("password").value;
}

function logOut() {
  history.pushState(null,null,'#login');
  document.body.classList.toggle("logged-in", false);
}

document
  .getElementById("login-page")
  .addEventListener("input", () => document.body.classList.toggle("error", false));

document
  .getElementById("login-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    tryLogin()
  });

document
  .getElementById("logoutButton")
  .addEventListener("click", () => logOut());

async function tryLogin() {
  const credential = new stitch.UserPasswordCredential(getUser(), getPass())
  client.auth.loginWithCredential(credential)
  // Realm.Credentials.emailPassword(getUser(), getPass())
  // app.logIn(credentials)
  .then(() => {
    history.pushState(null,null,'#charts');
    const sdk = new ChartsEmbedSDK({
      baseUrl: BASE_URL, // Charts URL
      getUserToken: () => ChartsEmbedSDK.getRealmUserToken(client),
    });

    const chart_zip = sdk.createChart({
      chartId: CHART_ID_ZIP, // Chart ID
    });

    chart_zip.render(document.getElementById("chart_zip"))
      .then(
        () => chart_zip.addEventListener("click", 
          (payload) => {
            chart_cuisine.setFilter(payload.selectionFilter);
            chart_score.setFilter(payload.selectionFilter);
            chart.setFilter(payload.selectionFilter);
          }
        )
      );

    const chart_cuisine = sdk.createChart({
      chartId: CHART_ID_CUISINE, // Chart ID
    });

    chart_cuisine.render(document.getElementById("chart_cuisine"))
      .then(
        () => chart_cuisine.addEventListener("click", 
          (payload) => {
            chart_zip.setFilter(payload.selectionFilter);
            chart_score.setFilter(payload.selectionFilter);
            chart.setFilter(payload.selectionFilter);
          }
        )
      );
    
    const chart_score = sdk.createChart({
      chartId: CHART_ID_SCORE, // Chart ID
    });

    chart_score.render(document.getElementById("chart_score"))
      .then(
        () => chart_score.addEventListener("click", 
          (payload) => {
            chart_zip.setFilter(payload.selectionFilter);
            chart_cuisine.setFilter(payload.selectionFilter);
            chart.setFilter(payload.selectionFilter);
          }
        )
      );

    const chart = sdk.createChart({
      chartId: CHART_ID, // Chart ID
    });

    chart.render(document.getElementById("chart"));

    document.body.classList.toggle("logged-in", true);

    document
    .getElementById("refreshButton")
    .addEventListener("click", () => {
      chart_zip.refresh();
      chart_cuisine.refresh();
      chart.refresh();
    });  

  }).catch(err => {
    console.error("Authentication failed. If you are using the pre-built sample, please use one of the listed email addresses and use 'password' as the password.")
    document.body.classList.toggle("error", true);
  });
}
