import React, { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// import { Route, Switch } from 'react-router'
// import Home from '../components/Home'
// import Hello from '../components/Hello'
// import Counter from '../components/Counter'
// import NoMatch from '../components/NoMatch'
// import NavBar from '../components/NavBar'
const Home = lazy(() => import('../components/Home'))
const Hello = lazy(()=>import('../components/Hello'))
const Counter = lazy(()=>import('../components/Counter'))
const NoMatch = lazy(()=>import('../components/NoMatch'))
const NavBar = lazy(()=>import('../components/NavBar'))

const routes = (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/hello" component={Hello} />
        <Route path="/counter" component={Counter} />
        <Route component={NoMatch} />
      </Switch>
    </Suspense>
  </Router>
)

export default routes
