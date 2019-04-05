const express = require('express');
const soap = require('soap');
const bodyParser = require('body-parser')
const url = 'https://passport.psu.ac.th/authentication/authentication.asmx?wsdl';
const app = express()
const cors = require('cors');
const router = express.Router()
var session = require('express-session')
app.set('views', './views')
app.set('view engine', 'ejs')

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}), router)
app.use(bodyParser.json, router)


app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 },
   resave : false, saveUninitialized: false }))

const out = `
<html>
<head>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
   <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
   <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
   <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</head>
<body>



</body>
</html>
`

router.route('/')
   .get((req, res) => {
       // res.send(out)
      // res.render('current',{detail:req.session.email})
       res.render('Index',{detail:req.session})
   })
   .post((req, res) => {
     var sess = req.session
       soap.createClient(url, (err, client) => {
           if (err) console.error(err);
           else {
               let user = {}
               user.username = req.body.username
               user.password = req.body.password

               client.GetStaffDetails(user, function (err, response) {
                   // client.GetStudentDetails(args, function(err, response) {
                   sess = response
                   if (err) console.error(err);
                   else {
                       console.log(response);

                       res.render('Index',{detail:sess.GetStaffDetailsResult.string});
                   }
               });
           }
       });
   })

// const whitelist = ['http://localhost:5000']
// const corsOptions = {
//     origin:function(origin,callback){
//         if(whitelist.indexOf(origin) !== -1){
//             callback(null,true);
//         }
//         else {
//             callback(new Error('not allow by CORS'))
//         }
//     }
// }

// app.get('/user-with-cors',cors(corsOptions) , (req,res,next) => {
//     soap.createClient(url, (err, client) => {
//         if (err) console.error(err);
//         else {
//             let user = {}
//             user.username = req.body.username
//             user.password = req.body.password

//             client.GetStaffDetails(user, function (err, response) {
//                 // client.GetStudentDetails(args, function(err, response) {
//                 if (err) console.error(err);
//                 else {
//                     console.log(response);
//                     res.send(response);
//                 }
//             });
//         }
//     });
// })

app.listen(5000, () => console.log('Server is ready!'))
