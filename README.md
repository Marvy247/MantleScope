# Mantle Observatory

> Real-time Network Intelligence Platform for Mantle Network

![Mantle Observatory](https://img.shields.io/badge/Built%20For-Mantle%20Hackathon%202025-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-Animated-purple)

## 🎯 Project Overview

**Mantle Observatory** is a comprehensive observability platform built specifically for the Mantle Network ecosystem. It provides real-time monitoring, analytics, and insights into the network's modular architecture, empowering developers and operators to build and maintain high-performance decentralized applications.

### 🏆 Hackathon Track
**Infrastructure & Tooling** - Building critical developer infrastructure for the Mantle ecosystem

## ✨ Key Features

### 1. **Real-Time Network Monitoring** ✅ LIVE DATA
- **Live Metrics Dashboard**: Track TPS, gas prices, and block data from **real Mantle RPC**
- **Modular Layer Insights**: Monitor execution, consensus, and data availability layers independently
- **Performance Analytics**: Historical performance charts with **actual blockchain data**
- **Real Block Data**: Fetches and analyzes real Mantle blockchain blocks every 3 seconds

### 2. **Smart Contract Analyzer** 🔥 UNIQUE FEATURE
- **Bytecode Analysis**: Deep analysis of contract bytecode patterns
- **Security Detection**: Identifies proxy patterns, reentrancy guards, access control
- **Gas Optimization Score**: 0-100 scoring system for contract efficiency
- **Mantle-Specific Recommendations**: Tailored optimization tips for Mantle's architecture
- **Feature Detection**: Automatic detection of EIP-1967, pausable, ownable patterns
- **Risk Assessment**: Identifies potential security vulnerabilities
- **One-Click Analysis**: Just paste contract address and get instant insights

### 3. **Real Transaction Intelligence** ✅ LIVE DATA
- **Live Transaction Feed**: Real-time transaction streaming from **Mantle blockchain**
- **Smart Classification**: Automatically categorizes transfers, contract calls, and swaps
- **Transaction Details**: Gas usage, value, addresses, and block information
- **Status Tracking**: Success/failed status for each transaction

### 4. **Network Health Monitoring**
- **Comprehensive Health Scoring**: Visual health percentage based on multiple metrics
- **Layer-Specific Monitoring**: Individual health checks for each modular component
- **Uptime Tracking**: Monitor network uptime and validator status
- **Anomaly Detection**: Automatic alerts for network irregularities

### 5. **Advanced Search & Filtering**
- **Universal Search**: Search transactions, addresses, and blocks from a single interface
- **Quick Actions**: Context-aware suggestions for common operations
- **Real-time Results**: Instant search results as you type

### 6. **Alert System**
- **Smart Notifications**: Real-time alerts for critical network events
- **Customizable Alerts**: Configure thresholds for custom notifications
- **Alert Categories**: Info, warning, critical, and success notifications
- **Alert History**: Track and review past notifications

### 7. **Beautiful, Animated UI**
- **Smooth Animations**: Powered by Framer Motion for delightful interactions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark theme optimized for extended monitoring sessions
- **Glassmorphism Effects**: Modern UI with backdrop blur and gradient overlays
- **Tab Navigation**: Easy switching between Dashboard and Contract Analyzer

## 🛠 Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Framer Motion** - Animation library
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React component library
- **Lucide Icons** - Beautiful, consistent icons

### Web3 Integration
- **Wagmi** - React Hooks for Ethereum
- **Viem** - TypeScript Interface for Ethereum
- **Reown AppKit** - Wallet connection management

### Data Fetching
- **TanStack Query** - Async state management with real-time updates
- **Custom API Routes** - Next.js API routes for data aggregation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Mantle Network RPC endpoint (optional for development)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/mantle-observatory.git
cd mantle-observatory/app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.mantle.xyz
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes for data fetching
│   │   │   ├── health/       # Network health endpoints
│   │   │   ├── metrics/      # Metrics endpoints
│   │   │   ├── performance/  # Performance data endpoints
│   │   │   └── transactions/ # Transaction data endpoints
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── AlertsPanel.tsx  # Notification system
│   │   ├── Dashboard.tsx    # Main dashboard
│   │   ├── Header.tsx       # Header with search & alerts
│   │   ├── MetricCard.tsx   # Animated metric cards
│   │   ├── NetworkHealth.tsx # Health monitoring
│   │   ├── PerformanceChart.tsx # Performance charts
│   │   ├── SearchBar.tsx    # Search functionality
│   │   └── TransactionFeed.tsx # Live transaction feed
│   ├── hooks/               # Custom React hooks
│   │   ├── useHealth.ts    # Health data hook
│   │   ├── useMetrics.ts   # Metrics data hook
│   │   ├── usePerformance.ts # Performance data hook
│   │   └── useTransactions.ts # Transactions data hook
│   └── lib/                # Utility functions
├── config/                 # Configuration files
├── context/               # React context providers
└── public/                # Static assets
```

## 🔧 API Endpoints

### GET `/api/metrics`
Returns current network metrics including TPS, gas prices, active contracts, and DA layer size.

**Response:**
```json
{
  "tps": { "value": 2847, "change": "+12.5" },
  "gasPrice": { "value": "0.023", "change": "-5.2" },
  "activeContracts": { "value": 15234, "change": "+3.8" },
  "daLayerSize": { "value": "847.2", "change": "+8.1" }
}
```

### GET `/api/transactions?limit=10`
Returns recent transactions with pagination.

### GET `/api/health`
Returns network health metrics and overall health score.

### GET `/api/performance?hours=24`
Returns historical performance data for the specified time range.

## 🎨 Key Components

### Dashboard
The main dashboard component that orchestrates all other components and manages the overall layout.

### MetricCard
Animated cards displaying key network metrics with trend indicators and smooth transitions.

### PerformanceChart
Interactive bar chart showing historical TPS data with hover tooltips and real-time updates.

### NetworkHealth
Circular health score visualization with detailed status for each network component.

### TransactionFeed
Live-updating transaction feed with type classification and smooth enter/exit animations.

### SearchBar
Universal search component with autocomplete and quick action suggestions.

### AlertsPanel
Notification center for network alerts and important events.

## 🎯 What Makes This Special

### Real Blockchain Integration ✅
- ✅ Connected to **real Mantle RPC endpoints**
- ✅ Fetches **actual blockchain data** every 2-3 seconds
- ✅ Uses **viem** for efficient blockchain interactions
- ✅ Implements caching to avoid overwhelming RPC

### Unique Contract Analyzer ✅
- ✅ **First-of-its-kind** for Mantle Network
- ✅ Bytecode pattern recognition
- ✅ Mantle-specific optimization recommendations
- ✅ Security vulnerability detection
- ✅ Gas optimization scoring

### Production-Ready Architecture ✅
- ✅ Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ API route caching for performance
- ✅ Error handling and fallbacks
- ✅ Responsive design

## 🔮 Future Enhancements

### Phase 2: Enhanced Analytics
- [ ] Custom dashboard builder
- [ ] Data export functionality (CSV, JSON)
- [ ] Advanced filtering and querying
- [ ] Contract-specific monitoring
- [ ] Validator performance tracking

### Phase 4: Developer Tools
- [ ] Smart contract debugging tools
- [ ] Gas optimization recommendations
- [ ] Transaction simulation
- [ ] RPC endpoint health checker
- [ ] Network comparison tools

### Phase 5: Collaboration Features
- [ ] Team workspaces
- [ ] Shared dashboards
- [ ] Custom alert rules
- [ ] API access for integrations
- [ ] Webhook notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Mantle Network** - For providing an excellent Layer 2 platform
- **HackQuest** - For organizing the hackathon
- **shadcn/ui** - For the beautiful component library
- **Framer Motion** - For smooth animations

## 📞 Contact

- **GitHub**: [@yourusername](https://github.com/yourusername)
- **Twitter**: [@yourusername](https://twitter.com/yourusername)
- **Email**: your.email@example.com

---

Built with ❤️ for the Mantle Global Hackathon 2025
