// https://github.com/jlongster/react-redux-universal-hot-example/blob/master/src/server.js

const React = require('react')
const { renderToString } = require('react-dom/server')
const { Provider } = require('react-redux')
const { createHistory } = require('history')
const { Router, RoutingContext, match } = require('react-router')

const createStore = require('app/store')
const createRoutes = require('app/routes')
const fetchAllData = require('app/util/fetch-all-data')

module.exports = createRender

function createRender (config) {
  return function render (req, res) {
    const store = createStore()

    match({
      routes: createRoutes(store),
      location: req.path
    }, function (err, redirectLocation, renderProps) {
      if (redirectLocation) {
        res.redirect(redirectLocation.pathname + redirectLocation.search)
      } else if (err) {
        res.status(500).send(err.message)
      } else if (!renderProps) {
        res.status(404).send('Not found')
      } else {
        fetchAllData(
          renderProps.components,
          store.getState, store.dispatch,
          renderProps.location,
          renderProps.params
        ).then(function () {
          const component = <Provider store={store} key="provider">
            <RoutingContext { ...renderProps } />
          </Provider>

          var innerHtml
          try {
            innerHtml = renderToString(component)
          } catch (err) {
            res.setHeader('content-type', 'text/plain')
            return res.status(500).send(err.stack)
          }

          const html = renderFullPage(innerHtml, store.getState())

          res.send(html)
        })
      }
    })
  }
}

function renderFullPage (innerHtml, initialData) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Happy Flat :)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href='https://fonts.googleapis.com/css?family=Amatic+SC:400,700' rel='stylesheet' type='text/css'>
      </head>
      <body>
        <main>${ innerHtml }</main>
        <script>
          window.__data = ${ JSON.stringify(initialData) }
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `
}
