const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const usersRepo = require("./repositories/users");
const { response } = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ["763yr#eu%ih!73@y2!dyWEF$65etg"],
  })
);
app.get("/signup", (req, res) => {
  res.send(`
   <div>
   Your Id is: ${req.session.userId}
       <form method="POST">
          <input name="email" placeholder="email" />
          <input name="password" placeholder="password" />
          <input name="passwordConfirmation" placeholder="password confirmation" />
          <button>Sign Up</button>
       </form>
   </div>
  `);
});

app.post("/signup", async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;

  const existingUser = await usersRepo.getOneBy({ email });
  if (existingUser) {
    return res.send("Email in use");
  }

  if (password !== passwordConfirmation) {
    return res.send("Passwords must match");
  }

  // Create user
  const user = await usersRepo.create({ email, password });

  // Store the id in the user cookie
  req.session.userId = user.id;

  res.send("Account created!!");
});

app.get("/signout", (req, res) => {
  req.session = null;
  res.send("you are logged out");
});

app.get("/signin", (req, res) => {
  res.send(`
  <div>
  <form method="POST">
     <input name="email" placeholder="email" />
     <input name="password" placeholder="password" />
     <button>Sign In</button>
  </form>
</div>
  `);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const user = await usersRepo.getOneBy({ email });

  if (!user) {
    return res.send("Email not found");
  }

  if (user.password !== password) {
    return res.send("Invalid password");
  }

  req.session.userId = user.id;

  res.send("you are signed in!");
});

app.listen(3000, () => {
  console.log("Listening");
});
