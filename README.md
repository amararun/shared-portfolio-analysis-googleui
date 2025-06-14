# Portfolio Analysis Suite UI
A modern React-based web interface for comprehensive portfolio analysis, built primarily using Google AI Studio Build. This repository contains the frontend UI code that integrates with multiple FastAPI-MCP backend servers.

### Statcounter Note
The application includes a Statcounter web analytics code patch in `index.html`. This tracking code is linked to my personal account, so all analytics data will be sent there. Please replace it with your own Statcounter ID or other analytics tracking code, or remove it entirely if you don't need web analytics.


## AI Co-Analyst Platform

For additional data analysis capabilities, visit our AI Co-Analyst Platform at [rex.tigzig.com](https://rex.tigzig.com). For any questions, reach out to me at amar@harolikar.com

## Components

The application consists of four main analysis modules:
- **QuantStats Analyzer**: Portfolio performance and risk metrics analysis
- **Security Performance Report**: Custom calculations + FFN package, CSV Exports
- **AI Technical Analysis**: Advanced technical indicators and chart patterns
- **Financials**: Company financial data and metrics
- **Price Data**: Historical price data analysis

Each component interfaces with dedicated FastAPI-MCP backend servers for data processing and analysis.

## Backend Services

All backend server repositories and documentation are available at:
- [QuantStats Analysis Server](https://rex.tigzig.com/mcp-server-quantstats)
- [Technical Analysis Server](https://rex.tigzig.com/mcp-server-technical-analysis)
- [Financial Data & Historical Prices Server](https://rex.tigzig.com/mcp-server-yahoo-finance)

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/portfolio-analysis-suite-ui.git

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

The application can be easily deployed to platforms like Vercel or Netlify. 


## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Built with Google AI Studio
