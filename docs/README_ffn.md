# FFN Portfolio Analysis API

## Repository: `shared-fastap-mcp-ffn`

A professional FastAPI-based portfolio analysis application powered by the **FFN (Financial Functions)** library. This application provides comprehensive portfolio analytics with beautiful HTML reports, CSV data exports, and MCP (Model Context Protocol) integration for AI agents.

## 🎯 What This Application Does

This application performs **quantitative portfolio analysis** using the open-source **FFN library** - a powerful Python package for financial analysis. It provides:

### 📊 **Portfolio Analytics Features:**
- **Performance Metrics**: Total returns, CAGR, Sharpe ratio, Sortino ratio, Calmar ratio
- **Risk Analysis**: Maximum drawdown, volatility, drawdown periods and analysis  
- **Visual Charts**: Cumulative returns charts, CAGR bar charts with professional styling
- **Monthly Returns**: Detailed month-by-month performance breakdown
- **Data Exports**: Multiple CSV files with price data, returns, correlations, and statistics

### 🎨 **Professional Reports:**
- **HTML Reports**: Beautiful, responsive reports with REX AI branding
- **Interactive Charts**: Professional matplotlib charts with proper scaling
- **Multiple Formats**: HTML for viewing + CSV files for data analysis
- **Mobile Responsive**: Reports work on all screen sizes

### 🤖 **AI Integration:**
- **MCP Protocol**: Full Model Context Protocol support for AI agents
- **JSON API**: Clean REST API for programmatic access
- **Structured Data**: Well-formatted JSON responses for AI consumption

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8+
- pip package manager

### Quick Start
```bash
# Clone the repository
git clone https://github.com/yourusername/shared-fastap-mcp-ffn.git
cd shared-fastap-mcp-ffn

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
```

The application will be available at: **http://localhost:8000**

---

## 📡 API Documentation

### **Base URL**: `http://localhost:8000` (local) or your deployment URL

---

## 🔧 **Primary Endpoint: Portfolio Analysis**

### **POST /analyze**

Generate comprehensive portfolio analysis reports with multiple data exports.

#### **Request Format:**
```json
{
  "symbols": "AAPL,MSFT,GOOG",
  "start_date": "2023-01-01", 
  "end_date": "2023-12-31",
  "risk_free_rate": 5.0
}
```

#### **Request Parameters:**
| Parameter | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `symbols` | string | ✅ | Comma-separated Yahoo Finance ticker symbols | `"AAPL,MSFT,GOOG"` |
| `start_date` | string | ✅ | Analysis start date (YYYY-MM-DD format) | `"2023-01-01"` |
| `end_date` | string | ✅ | Analysis end date (YYYY-MM-DD format) | `"2023-12-31"` |
| `risk_free_rate` | float | ❌ | Annual risk-free rate percentage (default: 0.0) | `5.0` |

#### **Response Format:**
```json
{
  "html_report_ffn_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022.html",
  "input_price_data_csv_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022_price_data.csv",
  "cumulative_returns_csv_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022_cumulative_returns.csv",
  "success": "Portfolio analysis report generated successfully!"
}
```

#### **Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `html_report_ffn_url` | string | URL to access the complete HTML report with charts and analytics |
| `input_price_data_csv_url` | string | URL to download raw price data CSV file |
| `cumulative_returns_csv_url` | string | URL to download cumulative returns CSV file |
| `success` | string | Success message confirming report generation |

---

## 🌐 **Web Interface Endpoint**

### **POST /api/analyze**

Alternative endpoint for web form submissions (same functionality as `/analyze` but accepts form data).

#### **Request Format** (Form Data):
```
symbols=AAPL,MSFT,GOOG
start_date=2023-01-01
end_date=2023-12-31
risk_free_rate=5.0
```

#### **Response Format:**
```json
{
  "success": true,
  "message": "Report generated successfully!",
  "html_report_ffn_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022.html",
  "input_price_data_csv_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022_price_data.csv",
  "cumulative_returns_csv_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022_cumulative_returns.csv"
}
```

---

## 🤖 **MCP (Model Context Protocol) Integration**

### **POST /mcp**

For AI agents and LLM applications. The MCP endpoint exposes the portfolio analysis functionality.

#### **Available Operations:**
- `analyze_portfolio` - Complete portfolio analysis with reports

#### **MCP Request Format:**
```json
{
  "operation_id": "analyze_portfolio",
  "parameters": {
    "symbols": "AAPL,MSFT,GOOG",
    "start_date": "2023-01-01",
    "end_date": "2023-12-31", 
    "risk_free_rate": 5.0
  }
}
```

---

## 📊 **Generated Data Files**

When you run an analysis, the system generates **6 different CSV files** plus an HTML report:

### **CSV Files Generated:**
1. **`*_price_data.csv`** - Raw daily prices for all securities
2. **`*_daily_returns.csv`** - Daily percentage returns
3. **`*_cumulative_returns.csv`** - Cumulative returns over time
4. **`*_summary_statistics.csv`** - Key performance metrics
5. **`*_correlation_matrix.csv`** - Correlation matrix between securities
6. **`*_monthly_returns.csv`** - Monthly return breakdown

### **HTML Report Includes:**
- **REX AI Professional Header** with branding
- **Data Summary** - Date ranges, trading days, price information
- **Performance Statistics** - Comprehensive FFN metrics table
- **Drawdown Analysis** - Detailed drawdown periods and magnitudes
- **Monthly Returns Tables** - Month-by-month performance
- **Visual Charts** - Cumulative returns and CAGR bar charts
- **Professional Footer** - Contact information and links

---

## 🎯 **Example Usage for AI Coders**

### **Python Example:**
```python
import requests

# Portfolio analysis request
url = "http://localhost:8000/analyze"
payload = {
    "symbols": "AAPL,MSFT,GOOG",
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "risk_free_rate": 2.5
}

response = requests.post(url, json=payload)
result = response.json()

print("HTML Report:", result["html_report_ffn_url"])
print("Price Data:", result["input_price_data_csv_url"]) 
print("Returns Data:", result["cumulative_returns_csv_url"])
```

### **JavaScript Example:**
```javascript
const response = await fetch('http://localhost:8000/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    symbols: "AAPL,MSFT,GOOG",
    start_date: "2023-01-01",
    end_date: "2023-12-31",
    risk_free_rate: 2.5
  })
});

const result = await response.json();
console.log('Report generated:', result.html_report_ffn_url);
```

### **cURL Example:**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "symbols": "AAPL,MSFT,GOOG",
    "start_date": "2023-01-01",
    "end_date": "2023-12-31",
    "risk_free_rate": 2.5
  }'
```

---

## ⚙️ **Configuration**

### **Environment Variables**
Create a `.env` file for configuration:

```env
# Development vs Production Mode
IS_LOCAL_DEVELOPMENT=1

# Base URL for generated report links
BASE_URL_FOR_REPORTS=http://localhost:8000/

# Server Configuration  
PORT=8000
HOST=0.0.0.0
```

### **Deployment Modes:**

#### **Local Development** (`IS_LOCAL_DEVELOPMENT=1`):
- URLs are relative: `/static/reports/filename.html`
- Perfect for localhost development

#### **Production** (`IS_LOCAL_DEVELOPMENT=0`):  
- URLs are absolute: `https://yourdomain.com/static/reports/filename.html`
- Required for remote deployment

---

## 🛠 **Technical Stack**

- **FastAPI** - Modern Python web framework
- **FFN Library** - Financial analysis and portfolio metrics
- **Matplotlib & Seaborn** - Professional chart generation
- **yfinance** - Yahoo Finance data fetching
- **Pandas & NumPy** - Data manipulation and analysis
- **Jinja2** - HTML template rendering
- **fastapi-mcp** - Model Context Protocol integration

---

## 📈 **Supported Financial Metrics**

The FFN library provides these comprehensive metrics:

### **Return Metrics:**
- Total Return, CAGR (Compound Annual Growth Rate)
- Daily/Monthly/Yearly returns breakdown
- Lookback returns (MTD, 3M, 6M, YTD, 1Y, etc.)

### **Risk Metrics:**
- Sharpe Ratio, Sortino Ratio, Calmar Ratio
- Maximum Drawdown, Average Drawdown
- Volatility (Daily/Monthly/Yearly)
- Skewness and Kurtosis

### **Statistical Analysis:**
- Best/Worst Day/Month/Year performance
- Win percentages for different time periods
- Correlation analysis between securities
- Drawdown period analysis with start/end dates

---

## 🔗 **API Response Examples**

### **Successful Response:**
```json
{
  "html_report_ffn_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022.html",
  "input_price_data_csv_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022_price_data.csv", 
  "cumulative_returns_csv_url": "/static/reports/report_AAPL-MSFT-GOOG_20241201_143022_cumulative_returns.csv",
  "success": "Portfolio analysis report generated successfully!"
}
```

### **Error Response Examples:**

#### **400 Bad Request** (Missing parameters):
```json
{
  "detail": "Missing required fields"
}
```

#### **400 Bad Request** (Invalid date range):
```json
{
  "detail": "Error fetching stock data: No data available for the provided symbols in the date range 2023-01-01 to 2023-12-31"
}
```

#### **500 Internal Server Error**:
```json
{
  "detail": "Error generating analysis: [specific error message]"
}
```

---

## 🎯 **Quick Copy-Paste for AI Coders**

```
ENDPOINT: POST /analyze
URL: http://localhost:8000/analyze

REQUEST:
{
  "symbols": "AAPL,MSFT,GOOG",
  "start_date": "2023-01-01", 
  "end_date": "2023-12-31",
  "risk_free_rate": 5.0
}

RESPONSE:
{
  "html_report_ffn_url": "URL_TO_HTML_REPORT",
  "input_price_data_csv_url": "URL_TO_PRICE_DATA_CSV",
  "cumulative_returns_csv_url": "URL_TO_RETURNS_CSV", 
  "success": "SUCCESS_MESSAGE"
}

USAGE: Financial portfolio analysis with FFN library
GENERATES: HTML report + multiple CSV data files
SUPPORTS: Multiple securities, custom date ranges, risk-free rate configuration
```

---

## 📝 **License**

MIT License - see LICENSE file for details.

## 🙏 **Acknowledgments**

- **[FFN Library](https://github.com/pmorissette/ffn)** - Core financial analysis engine
- **[FastAPI](https://fastapi.tiangolo.com/)** - High-performance web framework  
- **[yfinance](https://github.com/ranaroussi/yfinance)** - Yahoo Finance data integration 