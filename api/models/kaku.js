
module.exports = {
  init: function(mongoose) {

  	var Schema = mongoose.Schema;

    var kakuSchema = Schema({
      name: {
        type: String,
        default: ''
      },
      peopleLimit: {
        type: Number,
        default: 0
      },
      passport: {
        type: String,
        default: ''
      },
      creator: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      people: [{
        type: Schema.Types.ObjectId,
        ref: 'users'
      }],
      isDeleted: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });

    kakuSchema.statics.create = function() {

    };

    return kakuSchema;

  }
};