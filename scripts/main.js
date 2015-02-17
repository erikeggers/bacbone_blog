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
  template: _.template($('#blog-list-template').text()),

  events: {
    'click': 'viewPost'
  },

  viewPost: function(event){
    event.preventDefault();
    console.log(this.model);
    router.navigate('posts/' + this.model.id, {
      trigger: true
    });
  },

  render: function(){
    this.$el.html( this.template( this.model.toJSON() ) );
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


var PostDetailView = Backbone.View.extend({});


// Router //

  var AppRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'posts/:id': 'getPost',
    },

    initialize: function(){
      this.posts = new PostsCollection();
      this.postsList = new PostsListView({collection: this.posts});
      this.postItem = new PostItemView({collection: this.posts});
    },

    index: function(){
      this.posts.fetch();
      this.postsList.render();
    },

    getPost: function( id ){
      this.postItem.render();
    }

  });

  $(document).ready(function(){
    App.router = new AppRouter();
    Backbone.history.start();
  });

})();
