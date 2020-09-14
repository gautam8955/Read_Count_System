const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema( {
	
	unique_id: Number,

	email: {
		type: String,
		required: true,
		trim: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	phone_no: {
		type: Number,
		required: true,
		trim: true	
	},
	password: {
		type: String,
		required: true,
		trim: true
	},
	passwordConf: {
		type: String,
		required: true,
		trim: true
	}
})


userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('password', 'confirmPassword')) {
        user.password = await bcrypt.hash(user.password, 8)
        user.passwordConf = await bcrypt.hash(user.passwordConf, 8)

    }

    next()
})



const User = mongoose.model('User', userSchema);

module.exports = User;