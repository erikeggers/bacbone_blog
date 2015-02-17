(function() {

  'use strict';

  window.App = window.App || {};

  var Post = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function(attributes) {
      attributes = attributes || {};
      _.defaults(attributes, {
        title: '',
        body: '',
        timestamp: (new Date()).toString()
      });
      return attributes;
    }
  });

  var PostsCollection = Backbone.Collection.extend({

    url: 'http://tiny-pizza-server.herokuapp.com/collections/dudes',

    model: Post

  });

// Views //

var PostItemView = Backbone.View.extend({
  tagName: 'li',
  className: 'post',
  template: _.template($('#blog-list-template').text()),

  events: {
    'click .js-destroy': 'destroyPost',
  },

  render: function(){
    this.$el.html( this.template( this.model.toJSON() ) );
  },

  destroyPost: function(){
    this.model.destroy();
  }

});

var PostsListView = Backbone.View.extend({
  tagName: 'div',
  className: 'js-posts',

  initialize: function(){
     this.listenTo(this.collection, 'destroy sync', this.render);
  },

  render: function(){
    var self = this;
    this.$el.empty();

    this.collection.each(function(post){
     var itemView = new PostItemView({model: post});
     itemView.render();
     self.$el.append(itemView.el);
    });

    $('.posts-container').html(self.el);
    return this;
  }

});


var NewPostView = Backbone.View.extend({});


var PostDetailView = Backbone.View.extend({
  el: $('.js-post'),

  template: _.template($('#view-post-template').text()),

  render: function(){
    // this.$el.empty();
    this.$el.html(this.template(this.model.toJSON()));
  }

 });

// Router //

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'posts/:id': 'getPost',
    },

    initialize: function(){
      this.posts = new PostsCollection();
      this.postsList = new PostsListView({collection: this.posts});
      this.postDetailView = new PostDetailView();
    },

    index: function(){
      this.posts.fetch();
      this.postsList.render();
    },

    getPost: function( id ){
      this.postDetailView.model = this.posts.get(id);
      this.postDetailView.render();
      $('.posts-container').hide();
    }

  });

  $(document).ready(function(){
    App.router = new AppRouter();
    Backbone.history.start();
  });

})();
