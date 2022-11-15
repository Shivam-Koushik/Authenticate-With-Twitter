const express = require("express")
const app = express()
const session =require('express-session')
const ejs = require("ejs")
const LoginWithTwitter = require("login-with-twitter")
const Twit = require("twit")
const { raw, urlencoded } = require("express")

const tw = new LoginWithTwitter({
  consumerKey: '6cfVKVJAprMcxApn2LRBIciH4',
  consumerSecret: '8W9ZKuhuCcVk2ETiSctEOmSfMDSHthSQDjOc36cAZpNjgBfp4f',
    callbackUrl: 'https://authenticate-with-twitter-production.up.railway.app/sign'
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
   console.log(req.session.user)
    var T = new Twit({
        consumer_key: '6cfVKVJAprMcxApn2LRBIciH4',
        consumer_secret: '8W9ZKuhuCcVk2ETiSctEOmSfMDSHthSQDjOc36cAZpNjgBfp4f',
        access_token: req.session.user.userToken,
        access_token_secret: req.session.user.userTokenSecret
      })
      T.get('followers/ids', { screen_name: req.session.user.userName },  function (err, data, response) {
        console.log(data)
        console.log("Elevated access is active After 48H")
      })
})


app.listen(process.env.PORT, ()=>{
    console.log("server running")
})  
