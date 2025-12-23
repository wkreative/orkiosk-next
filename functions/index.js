const functions = require('firebase-functions')
const express = require('express')
const oauthProvider = require('decap-cms-oauth-provider')

const app = express()

const getConfig = () => {
  const cfg = functions.config()
  const projectId = process.env.GCLOUD_PROJECT || 'orkiosk-web'
  const baseUrlDefault = `https://us-central1-${projectId}.cloudfunctions.net/oauth`
  return {
    clientId: cfg.github && cfg.github.client_id,
    clientSecret: cfg.github && cfg.github.client_secret,
    baseUrl: (cfg.github && cfg.github.base_url) || baseUrlDefault,
  }
}

app.get('/', (_req, res) => {
  res.status(200).send('Decap CMS OAuth provider')
})

app.get('/auth', (req, res) => {
  const { clientId, clientSecret, baseUrl } = getConfig()
  if (!clientId || !clientSecret) {
    res.status(500).send('Missing GitHub OAuth configuration')
    return
  }
  return oauthProvider.auth({
    provider: 'github',
    client_id: clientId,
    client_secret: clientSecret,
    base_url: baseUrl,
  })(req, res)
})

app.get('/callback', (req, res) => {
  const { clientId, clientSecret, baseUrl } = getConfig()
  if (!clientId || !clientSecret) {
    res.status(500).send('Missing GitHub OAuth configuration')
    return
  }
  return oauthProvider.callback({
    provider: 'github',
    client_id: clientId,
    client_secret: clientSecret,
    base_url: baseUrl,
  })(req, res)
})

exports.oauth = functions.https.onRequest(app)
