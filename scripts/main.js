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

  events: {
    'click': 'getPost'
  },

  template: _.template($('#blog-list-template').text()),

  render: function(){
    this.$el.html( this.template( this.model.toJSON() ) );
  },

  getPost: function(event){
    event.preventDefault();
    console.log(this.model);
    router.navigate('posts/' + this.model.id, {
      trigger: true
    });
  }

});

var PostsListView = Backbone.View.extend({
  tagName: 'div',
  className: 'js-posts',

  initialize: function(){
     this.listenTo(this.collection, 'sync', this.render);
  },

  render: function(){
    var self = this;
    this.$el.empty();

    this.collection.each(function(post){
     var itemView = new PostItemView({model: post});
     itemView.render();
     self.$el.append(itemView.el);
    });

    $('.app-container').html(self.el);
    return this;
    }
  });


var NewPostView = Backbone.View.extend({});


var PostDetailView = Backbone.View.extend({
  el: 'article',
  template: _.template($('#view-post-template').text()),

  initialize: function() {
    this.listenTo(this.model, 'sync', this.render);
  },

  render: function(){
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
      this.post = new Post();
      this.postItem = new PostItemView({model: this.post});
      this.postsList = new PostsListView({collection: this.posts});
      this.postDetailView = new PostDetailView({model:this.post});
    },

    index: function(){
      this.posts.fetch();
      this.postsList.render();
    },

    getPost: function( id ){
      this.postDetailView.render();
    }

  });

  $(document).ready(function(){
    App.router = new AppRouter();
    Backbone.history.start();
  });

})();
