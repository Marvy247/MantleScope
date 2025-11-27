# MantleScope 🔭

> **Real-time Network Intelligence & Smart Contract Analysis Platform for Mantle Network**

![MantleScope](https://img.shields.io/badge/Built%20For-Mantle%20Hackathon%202025-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)

**Track:** Infrastructure & Tooling  
**Hackathon:** Mantle Global Hackathon 2025

---

## 🎯 Overview

MantleScope is a comprehensive observability and development platform built specifically for the Mantle Network ecosystem. Unlike generic block explorers, it provides:

- **Real-time blockchain data** from Mantle RPC endpoints
- **Smart contract bytecode analysis** with Mantle-specific optimizations
- **Developer-focused insights** for building better dApps
- **Beautiful, animated UI** with professional UX

## ✨ Key Features

### 1. 🔴 Real-Time Network Monitoring
- Live metrics from **actual Mantle blockchain** (TPS, gas prices, block data)
- Historical performance charts with real blockchain data
- Modular layer insights (execution, consensus, data availability)
- Network health scoring and monitoring

### 2. 🔥 Smart Contract Analyzer (UNIQUE)
**First-of-its-kind for Mantle Network**

- **Bytecode Pattern Recognition** - Detects proxies, upgradeable contracts, access control
- **Security Analysis** - Identifies reentrancy guards, pausable patterns, vulnerabilities
- **Gas Optimization Score** - 0-100 scoring based on code efficiency
- **Mantle-Specific Tips** - Recommendations leveraging Mantle's DA layer and architecture
- **Feature Detection** - Automatic detection of EIP-1967, ownable, pausable patterns
- **One-Click Analysis** - Just paste any Mantle contract address

### 3. 📊 Advanced Transaction Feed
- Real-time transaction streaming from Mantle blockchain
- Smart classification (transfers, contracts, swaps)
- Full pagination with customizable items per page
- Transaction details with copy-to-clipboard
- Status tracking (success/pending/failed)
- Direct links to Mantle Explorer

### 4. 🎨 Professional UI/UX
- Smooth animations powered by Framer Motion
- Dark theme optimized for developers
- Responsive design (desktop, tablet, mobile)
- Loading states and error handling
- Search with auto-suggestions
- Tab navigation between tools

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router)
- TypeScript 5
- Framer Motion (animations)
- Tailwind CSS 4
- shadcn/ui components

**Blockchain:**
- viem (Ethereum library)
- Real Mantle RPC integration
- Custom caching layer
- wagmi for Web3 connectivity

**Features:**
- TanStack Query for data fetching
- Real-time updates every 2-3 seconds
- Smart caching to avoid RPC overload
- Error boundaries and fallbacks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Navigate to app directory
cd "Mantle Hack/app"

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables (Optional)

Create `.env.local` in the app directory:

```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_MANTLE_RPC_URL=https://rpc.mantle.xyz
```

## 📖 Usage

### Dashboard View
1. **View live metrics** - TPS, gas prices, active contracts, DA layer size
2. **Monitor performance** - Historical charts with real blockchain data
3. **Watch transactions** - Real-time feed with pagination
4. **Check health** - Network health scoring

### Contract Analyzer
1. **Navigate** to "Contract Analyzer" tab
2. **Enter** a Mantle contract address (or click example)
3. **Analyze** - Get instant insights:
   - Gas optimization score
   - Security features
   - Detected patterns
   - Mantle-specific recommendations

### Search
1. **Type** any contract address in the search bar
2. **Press Enter** - Auto-navigates to Contract Analyzer
3. **Results** appear with full analysis

## 🎯 What Makes This Special

### Real Blockchain Integration ✅
- Connected to **real Mantle RPC endpoints**
- Fetches **actual blockchain data** every 2-3 seconds
- Uses **viem** for efficient interactions
- Implements smart caching

### Unique Contract Analyzer ✅
- **First-of-its-kind** for Mantle Network
- Bytecode pattern recognition
- Mantle-specific optimization tips
- Security vulnerability detection
- Gas optimization scoring

### Production-Ready ✅
- TypeScript for type safety
- Error handling and fallbacks
- Responsive design
- Comprehensive testing
- Build optimization

## 📁 Project Structure

```
Mantle Hack/
├── app/                          # Main Next.js application
│   ├── src/
│   │   ├── app/                  # App Router pages
│   │   │   ├── api/             # API routes
│   │   │   │   ├── metrics/     # Network metrics
│   │   │   │   ├── transactions/ # Transaction data
│   │   │   │   ├── health/      # Network health
│   │   │   │   ├── performance/ # Performance data
│   │   │   │   └── contract/    # Contract analysis
│   │   │   ├── layout.tsx       # Root layout
│   │   │   └── page.tsx         # Home page
│   │   ├── components/          # React components
│   │   │   ├── Dashboard.tsx    # Main dashboard
│   │   │   ├── ContractAnalyzer.tsx
│   │   │   ├── TransactionFeed.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── NetworkHealth.tsx
│   │   │   ├── PerformanceChart.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── AlertsPanel.tsx
│   │   │   └── ui/              # shadcn/ui components
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useMetrics.ts
│   │   │   ├── useTransactions.ts
│   │   │   ├── useHealth.ts
│   │   │   └── usePerformance.ts
│   │   └── lib/                 # Utilities
│   │       └── blockchain.ts    # Mantle RPC integration
│   ├── config/                  # Configuration
│   ├── context/                 # React context
│   ├── public/                  # Static assets
│   ├── README.md                # App-specific docs
│   ├── HACKATHON.md            # Hackathon submission details
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── package.json
└── README.md                    # This file
```

## 🎬 Demo

### Try These Mantle Contracts:
- **USDT**: `0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE`
- **WETH**: `0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111`
- **USDC**: `0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9`

### Example Analysis Output:
```
✅ Detected Features:
- Proxy Pattern
- Upgradeable (EIP-1967)
- Reentrancy Protection
- Ownable/Access Control

⚠️ Potential Risks:
- High complexity may increase gas costs

💡 Mantle Optimization Tips:
- Use batch transactions to leverage Mantle's DA layer efficiency
- Optimize storage reads - DA layer costs are lower
- Consider Mantle's native upgradability features

Gas Optimization Score: 85/100
```

## 🔗 Links

- **Live Demo**: [Coming Soon - Deploy to Vercel]
- **GitHub**: [This Repository]
- **Demo Video**: [Coming Soon]
- **Mantle Docs**: https://docs.mantle.xyz

## 🏆 Hackathon Submission

**Track**: Infrastructure & Tooling  
**Goal**: Build critical developer infrastructure for Mantle ecosystem

### Why This Deserves First Place:

1. **Solves Real Problems** - Fills critical gap in Mantle's developer tooling
2. **Unique Value** - Contract analyzer is first-of-its-kind for Mantle
3. **Production Ready** - Actually works with real blockchain data
4. **Technical Excellence** - Deep blockchain integration, bytecode analysis
5. **Beautiful Execution** - Professional UI, smooth animations
6. **Mantle-Specific** - Built specifically for Mantle's architecture
7. **Extensible** - Strong foundation for future features
8. **Well Documented** - Comprehensive docs and examples

### Comparison with Generic Explorers:

| Feature | Generic Explorer | MantleScope |
|---------|-----------------|-------------------|
| Real-time Data | ✅ | ✅ |
| Mantle-specific | ❌ | ✅ |
| Contract Analyzer | ❌ | ✅ |
| Gas Optimization | ❌ | ✅ |
| DA Layer Insights | ❌ | ✅ |
| Developer Tools | ❌ | ✅ |
| Beautiful UI | ❌ | ✅ |

## 🔮 Future Roadmap

### Phase 2: Enhanced Analytics (1-2 months)
- [ ] WebSocket integration for instant updates
- [ ] Transaction simulator
- [ ] Contract deployment cost estimator
- [ ] Historical data persistence with database
- [ ] Custom dashboard builder

### Phase 3: Advanced Tools (3-6 months)
- [ ] Advanced contract debugging tools
- [ ] API for third-party integrations
- [ ] Cross-chain comparison with other L2s
- [ ] Automated security auditing
- [ ] Gas optimization ML models

### Phase 4: Community (6-12 months)
- [ ] Team workspaces and collaboration
- [ ] Contract registry and verification
- [ ] Developer community features
- [ ] Mobile app
- [ ] Browser extension

## 🤝 Contributing

Contributions are welcome! This project will be open-sourced after the hackathon.

## 📝 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- **Mantle Network** - For providing an excellent Layer 2 platform
- **HackQuest** - For organizing the hackathon
- **viem & wagmi** - For excellent Web3 libraries

---

**Built for the Mantle Global Hackathon 2025**

*Making Mantle Network development easier, one contract at a time.*
