module.exports = {
  // Custom metrics processor for Socket.IO load tests
  
  /**
   * Called before the test starts
   */
  beforeScenario: function (userContext, events, done) {
    userContext.vars.connectionStart = Date.now()
    userContext.vars.eventsReceived = 0
    userContext.vars.eventsSent = 0
    return done()
  },

  /**
   * Track Socket.IO events
   */
  trackEvent: function (eventName, userContext, events, done) {
    userContext.vars.eventsSent++
    events.emit('counter', `socketio.events.sent.${eventName}`, 1)
    events.emit('counter', 'socketio.events.total_sent', 1)
    
    // Log high-frequency events
    if (userContext.vars.eventsSent > 100) {
      console.log(`⚠️  User sent ${userContext.vars.eventsSent} events`)
    }
    
    return done()
  },

  /**
   * Track received events
   */
  onEvent: function (eventName, data, userContext, events, done) {
    userContext.vars.eventsReceived++
    events.emit('counter', `socketio.events.received.${eventName}`, 1)
    events.emit('counter', 'socketio.events.total_received', 1)
    return done()
  },

  /**
   * Track connection time
   */
  onConnect: function (userContext, events, done) {
    const connectionTime = Date.now() - userContext.vars.connectionStart
    events.emit('histogram', 'socketio.connection_time', connectionTime)
    
    if (connectionTime > 2000) {
      console.log(`🔴 Slow connection: ${connectionTime}ms`)
      events.emit('counter', 'socketio.slow_connections', 1)
    }
    
    return done()
  },

  /**
   * Track disconnections
   */
  onDisconnect: function (userContext, events, done) {
    const sessionDuration = Date.now() - userContext.vars.connectionStart
    events.emit('histogram', 'socketio.session_duration', sessionDuration)
    events.emit('counter', 'socketio.disconnections', 1)
    
    console.log(`✅ Session ended: ${sessionDuration}ms, Sent: ${userContext.vars.eventsSent}, Received: ${userContext.vars.eventsReceived}`)
    
    return done()
  },

  /**
   * Track errors
   */
  onError: function (error, userContext, events, done) {
    console.log(`❌ Socket.IO error: ${error.message}`)
    events.emit('counter', 'socketio.errors', 1)
    return done()
  },
}

