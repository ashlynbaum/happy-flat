const React = require('react')
const { IndexRoute, Route } = require('react-router')

const IndexContainer = require('./containers/index')
const ShowContainer = require('./containers/show')
const GroupMembers = require('./components/group-members')
const ShoppingList = require('app/shopping-list/components/shopping-list')

module.exports = function createRoutes (store) {
  return <Route path="groups">
    <IndexRoute component={IndexContainer} />
    <Route path=":id" component={ShowContainer}>
      <IndexRoute component={GroupMembers} />
      <Route path="list" component={ShoppingList} />
    </Route>
  </Route>
}