import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import { DeliveryDisplay } from './pages/DeliveryDisplay'
import { DeliveryTrack } from './pages/DeliveryTrack'


export function App() {
  return (
    <div className="app">
      <Router>
          <Switch>
            <Route path="/track/:strIds" component={DeliveryTrack} />
            <Route path="/display/:id/:lat?/:lng?/:estimatedTime?/:estimatedDate?" component={DeliveryDisplay} />
          </Switch>
      </Router>
    </div>
  )
}

