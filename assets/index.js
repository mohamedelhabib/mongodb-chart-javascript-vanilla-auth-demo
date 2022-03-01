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
  .then(() =>
  {
    const sdk = new ChartsEmbedSDK({
      baseUrl: BASE_URL, // Charts URL
      getUserToken: () => ChartsEmbedSDK.getRealmUserToken(client),
    });

    const chart = sdk.createChart({
      chartId: CHART_ID, // Chart ID
    });

    chart.render(document.getElementById("chart"));
    document.body.classList.toggle("logged-in", true);

  }).catch(err => {
    console.error("Authentication failed. If you are using the pre-built sample, please use one of the listed email addresses and use 'password' as the password.")
    document.body.classList.toggle("error", true);
  });
}
