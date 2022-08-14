const express = require("express")
const cookieParser = require("cookie-parser")
const csurf = require("csurf")
//!  config of the package
const csrfProtection = csurf({ cookie: { httpOnly: true } })


app = express()

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

//! if you use this middleware on a GET request what it does is that it gives you a token value and place it on the request which will be placed in an input

app.get("/", csrfProtection, (req, res) => {

  // imagine this next line where we set the cookie instead only happened if you had just provided a correct username and password etc...
  res.cookie("simpletest", "qwerty", { httpOnly: true })

  res.send(`<form action="/transfer-money" method="POST">
              <input type="text" name="amount" placeholder="amount">
              <input type="text" name="to" placeholder="Send to...">
              <input type="hidden" name="_csrf" value="${req.csrfToken()}">
              <button>Submit</button>
           </form>`)
})

//^ now when you submit this form and send a POST request we also use this as a middleware and now what it will do is check for this token value with this name="_csrf" and if it doesnt match or the value was blank it is going to through an error with an error code of EBADCSRFTOKEN

app.post("/transfer-money", csrfProtection, (req, res) => {
  if (req.cookies.simpletest === "qwerty") {
    res.send("Success!")
  } else {
    res.send("Failed!")
  }
})

app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err)

  res.status(403).send("CSRF attack detected!")
})

app.listen(3000)
