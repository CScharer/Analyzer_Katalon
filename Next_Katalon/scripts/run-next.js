#!/usr/bin/env node

/**
 * Small helper to run Next.js commands with the port defined in .env (NEXT_PORT).
 */
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const projectRoot = path.resolve(__dirname, '..')

function loadEnv(filename) {
  const filePath = path.join(projectRoot, filename)
  if (!fs.existsSync(filePath)) {
    return
  }

  const contents = fs.readFileSync(filePath, 'utf8')
  contents.split('\n').forEach((rawLine) => {
    const line = rawLine.trim()
    if (!line || line.startsWith('#') || !line.includes('=')) {
      return
    }

    const [key, ...rest] = line.split('=')
    const value = rest.join('=').trim().replace(/^['"]|['"]$/g, '')
    if (!Object.prototype.hasOwnProperty.call(process.env, key.trim())) {
      process.env[key.trim()] = value
    }
  })
}

loadEnv('.env.local')
loadEnv('.env')

const mode = process.argv[2] || 'dev'
const validModes = new Set(['dev', 'start'])

if (!validModes.has(mode)) {
  console.error(`Unsupported mode "${mode}". Use "dev" or "start".`)
  process.exit(1)
}

const defaultPort = '3000'
const port = process.env.NEXT_PORT || process.env.PORT || defaultPort
process.env.PORT = port

const nextBin = require.resolve('next/dist/bin/next')
const args = [nextBin, mode, '-p', port]

const child = spawn(process.execPath, args, {
  stdio: 'inherit',
  cwd: projectRoot,
  env: process.env,
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})

