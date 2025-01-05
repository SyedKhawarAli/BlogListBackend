const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favoriteBlog = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog, blogs[0])
    return {
      title: favoriteBlog.title,
      author: favoriteBlog.author,
      likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
  const mostBlogsAutherAndNumber = _.chain(blogs)
    .countBy('author')
    .toPairs()
    .maxBy(_.last)
    .value()
  return {
    author: mostBlogsAutherAndNumber[0],
    blogs: mostBlogsAutherAndNumber[1]
  }
}

const mostLikes = (blogs) => {
  const mostLikesAuthor = _.chain(blogs)
    .groupBy('author')
    .map((blogs, author) => {
      return {
        author: author,
        likes: _.sumBy(blogs, 'likes')
      }
    })
    .maxBy('likes')
    .value()
  return mostLikesAuthor
}
  
module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}