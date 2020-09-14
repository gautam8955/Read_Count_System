const mongoose = require('mongoose');

const titleSchema = new mongoose.Schema( {
	
    unique_id: Number,
    
    Title: [{
        "title_no": Number,
        "titles": String
    }]
})

const Title = mongoose.model('Title', titleSchema);

module.exports = Title;