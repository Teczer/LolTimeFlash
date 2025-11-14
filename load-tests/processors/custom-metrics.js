module.exports = {
  // Custom metrics processor for HTTP load tests
  
  /**
   * Called before the test starts
   */
  beforeScenario: function (userContext, events, done) {
    userContext.vars.startTime = Date.now()
    return done()
  },

  /**
   * Called after each request
   */
  afterResponse: function (requestParams, response, userContext, events, done) {
    const duration = Date.now() - userContext.vars.startTime
    
    // Log slow requests
    if (response.timings && response.timings.response > 1000) {
      console.log(`⚠️  Slow request detected: ${requestParams.url} (${response.timings.response}ms)`)
    }
    
    // Track status codes
    events.emit('counter', `http.status.${response.statusCode}`, 1)
    
    return done()
  },

  /**
   * Called after the scenario completes
   */
  afterScenario: function (userContext, events, done) {
    const totalDuration = Date.now() - userContext.vars.startTime
    events.emit('histogram', 'scenario.duration', totalDuration)
    return done()
  },

  /**
   * Custom function to check response time
   */
  checkResponseTime: function (requestParams, response, userContext, events, done) {
    if (response.timings.response > 500) {
      console.log(`🔴 Response time exceeded 500ms: ${requestParams.url} (${response.timings.response}ms)`)
      events.emit('counter', 'custom.slow_responses', 1)
    }
    return done()
  },
}

