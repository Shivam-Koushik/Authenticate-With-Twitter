const express = require("express")
const app = express()
const session =require('express-session')
const ejs = require("ejs")
const LoginWithTwitter = require("login-with-twitter")
const Twit = require("twit")
const { raw, urlencoded } = require("express")

const tw = new LoginWithTwitter({
    consumerKey: 'VNkwYoU8lsOHOPlSdcjGUalib',
    consumerSecret: 'yUh1Qh0CyD0gNthK0ZuO5SQEwOvfx9Kf9xhc2dVn6frVaqEcqp',
    callbackUrl: 'http://localhost:8080/sign'
  })

app.set('view engine','ejs')
app.use(express.urlencoded())

app.use(session({
    secret: 'sgjiojesg',
    cookie: {}
}))

app.get("/",(req,res)=>{
    res.render('index')

})

app.get("/login",(req,res)=>{
    tw.login((err, tokenSecret, url) => {
        if (err) {
          res.send("ERROR")
        }    
      
        req.session.tokenSecret = tokenSecret
    
        res.redirect(url)
      })
})

app.get("/sign",(req,res)=>{
    var params = {
        oauth_token: req.query.oauth_token,
        oauth_verifier: req.query.oauth_verifier
      }
    tw.callback(params,req.session.tokenSecret,(err,user)=>{
          req.session.user = user
          res.redirect('/dash')
    })
})

app.get("/dash",(req,res)=>{
    if(req.session.user){
        // console.log(req.session.user)
        res.render('dash',{user:req.session.user})
    }else{
        res.redirect('/')
    }
   
})

app.get("/followers",(req,res)=>{
    var T = new Twit({
        consumer_key: 'VNkwYoU8lsOHOPlSdcjGUalib',
        consumer_secret: 'yUh1Qh0CyD0gNthK0ZuO5SQEwOvfx9Kf9xhc2dVn6frVaqEcqp',
        access_token: req.session.user.userToken,
        access_token_secret: req.session.user.userTokenSecret
      })
      console.log(req.session.user.userName)
      T.get('followers/ids', { screen_name: req.session.user.userName },  function (err, data, response) {
        console.log(data)
        console.log("Elevated access is active After 48H")
      })
})

app.listen(process.env.PORT, ()=>{
    console.log("server running")
})  
