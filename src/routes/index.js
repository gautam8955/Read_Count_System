var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
var User = require('../models/user');
var Story = require('../models/stories');

//Home
router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

//Registration
router.post('/', function(req, res, next) {
	console.log(req.body);
	var personInfo = req.body;


	if(!personInfo.email || !personInfo.name || !personInfo.phone_no || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							name: personInfo.name,
							phone_no: personInfo.phone_no,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":"You are regestered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) {
	return res.render('login.ejs');
});

//Login
router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email}, async (err,data) => {
		if(data){

			const isMatch = await bcrypt.compare(data.password, req.body.password)
			
			if(!isMatch){
				
				req.session.userId = data.unique_id;
				
				res.send({"Success":"Success!"});
				
			}else{	
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not regestered!"});
		}
	});
});

//Login Profile
router.get('/profile', function (req, res, next) {
	User.findOne({unique_id:req.session.userId},function(err,data){
		
		if(!data){
			res.redirect('/');
		}else{
			
			Story.find( function(err, result) {
				if (err) throw err;
				
				res.render('data.ejs', {"name":data.name,"email":data.email, "stories": result});
		})
			
		}
	});
});

//Logout
router.get('/logout', function (req, res, next) {
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) {
	res.render("forget.ejs");
});


//Forget Password
router.post('/forgetpass', function (req, res, next) {
	User.findOne({email:req.body.email},function(err,data){
		if(!data){
			res.send({"Success":"This Email Is not regestered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					//console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

//To insert stories in DB
router.post('/stories', async (req, res) => {
	const stories = new Story(req.body)

    try{
        await stories.save()
        res.status(201).send( {stories} )
    } catch (e) {
        res.status(400).send(e)
    }
})



//Count views
function countview(prodId) {
    Story.findByIdAndUpdate({ _id: prodId },{$inc: {viewCount: 1}}, {new: true})
    .then((data) => {console.log(data.viewCount)})
    .catch((err) => {console.log(err)})
}


//To get Content of Story
router.get('/getcontent/:id',  (req, res, next) => {
	const prodId = req.params.id;
	countview(prodId);
	Story.findOne({_id:prodId}, function(err, result) {
			if (err) throw err;
			return res.render('stories.ejs', {story:result});
	})

})


module.exports = router;