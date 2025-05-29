# 🚀 Web3 Gas Tracker DApp

A real-time Web3 gas fee tracker that monitors gas prices across multiple blockchain networks including Ethereum, Arbitrum, Optimism, Base, and Polygon.

![Gas Tracker Demo](https://via.placeholder.com/1200x600/1e293b/ffffff?text=Web3+Gas+Tracker+Dashboard)

## ✨ Features

- **Real-time Gas Tracking**: Monitor gas fees across 5 major networks
- **Live Price Updates**: Auto-refresh every 10 seconds (configurable)
- **Gas Price Trends**: Interactive charts showing price history
- **Network Comparison**: Instantly see cheapest vs most expensive networks
- **Congestion Indicators**: Visual indicators for network congestion levels
- **USD Cost Calculator**: Real-time USD cost estimates for transactions
- **Dark/Light Mode**: Toggle between themes
- **Mobile Responsive**: Optimized for all device sizes
- **Alert System**: Visual highlights for cheapest/most expensive networks

## 🌐 Supported Networks

| Network | Symbol | Chain ID | RPC Endpoint |
|---------|--------|----------|--------------|
| Ethereum | ETH | 1 | eth.llamarpc.com |
| Arbitrum | ETH | 42161 | arb1.arbitrum.io/rpc |
| Optimism | ETH | 10 | mainnet.optimism.io |
| Base | ETH | 8453 | mainnet.base.org |
| Polygon | MATIC | 137 | polygon-rpc.com |

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for gas price trends
- **Web3**: ethers.js for blockchain interactions
- **Animations**: Framer Motion
- **Theme**: next-themes for dark/light mode
- **Price Data**: CoinGecko API for ETH/USD rates

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd web3-gas-tracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to `http://localhost:3000`

### Production Build
```bash
npm run build
npm start
```

## 📊 API Sources

The application fetches gas data from multiple sources:

- **Ethereum**: Direct RPC calls + Etherscan Gas Oracle
- **Layer 2 Networks**: Direct RPC calls to network endpoints
- **ETH Price**: CoinGecko API for USD conversion
- **Fallback**: Multiple RPC providers for reliability

## 🎨 Design Features

- **Cyberpunk Aesthetic**: Dark-first design with neon accents
- **Real-time Indicators**: Pulse animations for live updates
- **Gas Meter Visualization**: Animated progress bars for congestion
- **Gradient Borders**: Dynamic highlighting for cheapest/expensive networks
- **Smooth Transitions**: Framer Motion animations throughout

## 🔧 Configuration

### Refresh Intervals
- 5 seconds (high frequency)
- 10 seconds (default)
- 30 seconds (balanced)
- 60 seconds (conservative)

### Gas Calculation
- Standard transaction: 21,000 gas limit
- USD conversion: Real-time ETH price from CoinGecko
- Congestion levels: Based on gas price vs base fee ratio

## 📱 Mobile Experience

- Responsive grid layout
- Touch-friendly controls
- Optimized chart interactions
- Collapsible settings menu

## 🚨 Error Handling

- Network timeout fallbacks
- Graceful API failure handling
- Loading states and skeletons
- Error boundaries for stability

## 🔒 Security

- No API keys exposed to client
- Public RPC endpoints only
- No wallet connections required
- CORS-compliant requests

## 📈 Performance

- Data caching (1-minute ETH price cache)
- Efficient re-renders with React optimization
- Chart data limited to last 20 points
- Lazy loading for heavy components

## 🎯 Future Enhancements

- [ ] Gas price alerts via notifications
- [ ] Historical data persistence
- [ ] Custom gas limit calculator
- [ ] Wallet connection for personalized alerts
- [ ] ENS integration
- [ ] Telegram/Discord webhooks
- [ ] More Layer 2 networks (Blast, Mantle, etc.)

## 📄 License

MIT License - feel free to use this project for your portfolio or commercial applications.

## 🤝 Contributing

Contributions welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

**Built with ⚡ by Web3 Developer Portfolio**

*Tracking the pulse of blockchain networks, one gas fee at a time.*