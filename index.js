const stdin = require('./stdin');
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull
} = require('graphql');

const database = {
  posts: [
    {
      id: 1,
      title: 'First post',
      tags: ['taga', 'tagb'],
      timestamp: 1
    },
    {
      id: 2,
      title: 'Second post',
      tags: ['taga'],
      timestamp: 2
    },
    {
      id: 3,
      title: 'Third post',
      tags: ['tagb'],
      timestamp: 3
    },
    {
      id: 4,
      title: 'Forth post',
      timestamp: 4
    }
  ]
};

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    tags: { type: new GraphQLList(GraphQLString) },
    timestamp: { type: GraphQLInt }
  }
});

const postQuerySchema = {
  type: postType,
  args: {
    id: {
      name: 'id',
      type: new GraphQLNonNull(GraphQLID)
    }
  },
  resolve: (root, params) =>
    database.posts[params.id - 1]
};

const postsQuerySchema = {
  type: new GraphQLList(postType),
  args: {
    tags: {
      name: 'tags',
      type: new GraphQLList(GraphQLString)
    }
  },
  resolve: (root, params) => (
    !params.tags ?
      database.posts :
      database.posts
        .filter(post => post.tags)
        .filter(post => post.tags.some(tag => params.tags.includes(tag)))
  )
};

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      post: postQuerySchema,
      posts: postsQuerySchema
    }
  })
});

stdin.read()
  .then((query) => {
    console.log('>>> Query');
    console.log(query);
    console.log();
    return query;
  })
  .then(query => graphql(schema, query))
  .then((result) => {
    console.log('>>> Result');
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((err) => {
    console.log('>>> Error');
    console.log(err);
  });
