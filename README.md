# Esselunga a casa - Puppeteer bot

## Getting Started

### .env file

Create a .env file with your Esselunga user name (for example, `your-name@example.com`) and password (for example, `your-secret-password`):

```
ESSELUNGA_USERNAME=your-name@example.com
ESSELUNGA_PASSWORD=your-secret-password
```

- See also: [dotenv](https://www.npmjs.com/package/dotenv)

## Running

```
node index.js
```

### Linux or WSL on Windows

Running periodically:

```
./run.sh
```

## TODO

- Properly test if slot reservation actually works
- Properly test if order checkout actually works
- Run as a daemon without a shell script
- Write logs to a file, not on standard output
- Pretty-print logs using `pino-pretty -t`
