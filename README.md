# Only Models Agency Website

This is a downloaded version of the Only Models Agency website. The files are organized in their original URL structure, which requires a specific setup to run locally.

## How to Launch the Website

### Option 1: Using the Provided Batch File (Windows)

1. Double-click on `start-server.bat`
2. Choose one of the server options:
   - Python HTTP Server (requires Python installed)
   - Node.js HTTP Server (requires Node.js installed)
   - Open with default browser (no server - limited functionality)

### Option 2: Using Visual Studio Code

1. Install the "Live Server" extension in VS Code
2. Open this folder in VS Code
3. Right-click on `index.html` and select "Open with Live Server"

### Option 3: Manual Server Setup

#### Using Python:
```
python -m http.server
```
Then open http://localhost:8000 in your browser

#### Using Node.js:
```
npm install -g http-server
http-server
```
Then open http://localhost:8080 in your browser

## Website Structure

The website is organized in the following structure:

- `index.html` - Main entry point that redirects to the actual content
- `fix-paths.html` - Helper file to fix paths in the website
- `onlymodels.agency/` - Contains the actual website files
  - `index.html` - Russian version of the website
  - `uk/my-mozhem-pomoch-vam-sozdat-uspeshnyj-profyl-onlyfans/index.html` - Ukrainian version of the website

## Troubleshooting

If you encounter issues with missing resources (images, CSS, JavaScript):

1. Make sure you're running the website through a local web server (not just opening the HTML file directly)
2. Try using the `fix-paths.html` file to navigate to the pages
3. Check your browser's developer console for specific errors

## Notes

- This website was downloaded from a mobile version, so some elements might be optimized for mobile viewing
- The website uses WordPress and requires proper path resolution to display correctly