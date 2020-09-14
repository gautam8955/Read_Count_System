const mongoose = require('mongoose');

const storySchema = new mongoose.Schema( {
	
	unique_id: Number,

	Title: {
		type: String,
		required: true,
		trim: true
	},
	Content: {
		type: String,
		required: true,
		trim: true
	},
	viewCount: {
		type: Number,
		required: true
	}
})






const Story = mongoose.model('Story', storySchema);

module.exports = Story;