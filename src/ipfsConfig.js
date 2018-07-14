const config = { 
  repo: 'ipfs-' + Math.random(),
  EXPERIMENTAL: {
    pubsub: true,
  },
  config: {
    Addresses: {
      Swarm: [
        '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star'
      ],
      API: '/ip4/127.0.0.1/tcp/5001',
      Gateway: '/ip4/127.0.0.1/tcp/8080'
    },
    Discovery: {
      MDNS: {
        Enabled: true,
        Interval: 10
      },
      webRTCStar: {
        Enabled: true
      }
    },
  }
};

module.exports = config;