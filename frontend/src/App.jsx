import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

import { DeliveryDisplay } from './pages/DeliveryDisplay'
import { DeliveryTrack } from './pages/DeliveryTrack'
import { Share } from './pages/Share'

export function App() {
  
  return (
    <div className="app">
      <Router>
          <Switch>
            <Route path="/track/:strIds" component={DeliveryTrack} />
            <Route path="/share" component={Share} />
            <Route path="/display/:id/:lat?/:lng?/:estimatedTime?/:estimatedDate?/:estimatedTimeTo?" component={DeliveryDisplay} />
          </Switch>
      </Router>
    </div>
  )
}

