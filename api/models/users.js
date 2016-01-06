
var util = require('../util/index.js');
var tagsModel = require('./tags.js');

module.exports = {

  userModel: undefined,
  themesModel: undefined,
  tagsModel: undefined,

  init: function(mongoose) {

  	var Schema = mongoose.Schema;

    var userSchema = Schema({
      username: String,
      email: String,
      password: String,
      sex: {
      	type: String,
      	default: ''
      },
      photo: {
      	type: String,
      	default: ''
      },
      intro: {
      	type: String,
      	default: ''
      },
      region: {
      	type: String,
      	default: '天朝'
      },
      group: Schema.Types.ObjectId,
      accessToken: {
        type: String,
        default: 'undefined'
      },
      tokenExpire: {
        type: Number,
        default: 77760000000 //15天
      },
      tokenCreatedAt: {
        type: Date,
        default: undefined
      },
      tokenDestoriedAt: {
        type: Date,
        default: undefined
      },
      createdAt: {
  		  type: Date,
  		  default: Date.now
      },
      updatedAt: {
  		  type: Date,
  		  default: Date.now
      },
      isBlocked: {
  		  type: Boolean,
  		  default: false
      },
      blockedAt: {
  		  type: Date,
  		  default: Date.now
      },
      isDeleted: {
    		type: Boolean,
    		default: false
      },
      deletedAt: {
  		  type: Date,
  		  default: Date.now
      }
    });

    userSchema.statics.findAll = function(page, count, cb) {
      page = page || 10;
      count = count || 20;

      var skipFrom = (page * count) - count;

      return this.find({
        isDeleted: false
      }).sort('createdAt').skip(skipFrom).limit(count).exec(cb);
    };

    userSchema.statics.findById = function(id, cb) {
      return this.find({
        _id: id,
        isDeleted: false
      },cb);
    };

    userSchema.statics.findByEmail = function(e, cb) {
    	return this.find({
    		email: e,
        isDeleted: false
    	}, cb);
    };

    userSchema.statics.findByUsername = function(e, cb) {
    	return this.find({
    		username: e,
        isDeleted: false
    	}, cb);
    };

    userSchema.statics.findByAccessToken = function(at, cb) {
      return this.find({
        accessToken: at
      },cb);
    };

    userSchema.statics.updateAccessToken = function(e, at, cAt, cb) {

      var createdAt = cAt;
      var destoriedAt = createdAt + 77760000000;

      var query = {
        email: e
      };

      var options = {
        new: true
      };

      var update = {
        accessToken: at,
        tokenCreatedAt: createdAt,
        tokenDestoriedAt: destoriedAt
      };

      return this.findOneAndUpdate(query, update, options, cb);

    };

    userSchema.statics.rollbackAccessToken = function(e, cb) {

      var createdAt = undefined;
      var destoriedAt = undefined;

      var query = {
        accessToken: e
      };

      var options = {
        new: true
      };

      var update = {
        tokenCreatedAt: createdAt,
        tokenDestoriedAt: destoriedAt
      };

      return this.findOneAndUpdate(query, update, options, cb);

    };

    var themesSchema = Schema({
      user_id: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      title: String,
      content: {
        type: String,
        default: ''
      },
      tag_list: [{
        type: Schema.Types.ObjectId,
        ref: 'tags'
      }],
      image: {
        type: String,
        default: ''
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      deletedAt: {
        type: Date,
        default: Date.now
      }
    });

    themesSchema.statics.findById = function(id, cb) {
      return this.find({
        _id: id,
        isDeleted: false
      }).populate('user_id').populate('tag_list').exec(cb);
    };

    themesSchema.statics.search = function(name, page, count, cb) {

      page = page || 1;
      count = count || 20;
      var skipFrom = (page * count) - count;

      return this.find({
        content: new RegExp(name),
        isDeleted: false
      }).populate({
        path: 'tag_list',
        select: '_id name description'
      }).populate({
        path: 'user_id',
        select: '_id username email'
      }).sort({
        createdAt: -1
      }).skip(skipFrom).limit(count).exec(cb);

    };

    themesSchema.statics.findByUid = function(uid, page, count, cb) {
      page = page || 1;
      count = count || 20;
      var skipFrom = (page * count) - count;

      return this.find({
        user_id: uid,
        isDeleted: false
      }).populate('user_id').populate('tag_list').sort({
        createdAt: -1
      }).skip(skipFrom).limit(count).exec(cb);
    };

    themesSchema.statics.findAll = function(page, count, cb) {
      page = page || 1;
      count = count || 20;
      var skipFrom = (page * count) - count;

      return this.find({
       isDeleted: false 
      }).populate('user_id').populate('tag_list').sort({
        createdAt: -1
      }).skip(skipFrom).limit(count).exec(cb);
    };

    themesSchema.statics.findAllRemoved = function(page, count, cb) {
      page = page || 1;
      count = count || 20;
      var skipFrom = (page * count) - count;

      return this.find({
       isDeleted: true 
      }).populate('user_id').populate('tag_list').sort({
        createdAt: -1
      }).skip(skipFrom).limit(count).exec(cb);
    };

    themesSchema.statics._remove = function(id, cb) {
      var query = {
        _id: id
      };

      var options = {
        new: true
      };

      var update = {
        isDeleted: true,
        deletedAt: Date.now()
      };

      return this.findOneAndUpdate(query, update, options, cb);
    };

    themesSchema.statics.update = function(id, obj, cb) {
      var query = {
        _id: id
      };

      var options = {
        new: true
      };

      var update = obj;

      return this.findOneAndUpdate(query, update, options, cb);
    };

    tagsSchema = tagsModel.init(mongoose);

    this.userModel = util.cacheMongooseModel(mongoose, userSchema, 'users', this.userModel);
    this.themesModel = util.cacheMongooseModel(mongoose, themesSchema, 'themes', this.themesModel);
    this.tagsModel = util.cacheMongooseModel(mongoose, tagsSchema, 'tags', this.tagsModel);

    var _this = this;

    return {
      users: _this.userModel,
      themes: _this.themesModel,
      tags: _this.tagsModel
    };

  }
};
