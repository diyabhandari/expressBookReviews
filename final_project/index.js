const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", (req, res, next) => {
    try {
        const { authorization } = req.session;
        if (authorization) {
            const token = authorization["accessToken"];

            // Verify
            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (!err) {
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({ message: "User not authenticated", error: err });
                }
            });
        } else {
            return res.status(403).json({ message: "User not logged in" });
        }
    } catch (error) {
        console.error("error", error)
        res.status(500).json({ error })
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
