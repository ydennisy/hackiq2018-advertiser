import IPFS from 'ipfs';
import config from './ipfsConfig';
import * as utils from './utils';
import {EventBus} from './EventBus';

const node = new IPFS(config);
const requestMap = new Map();


class Node {
  constructor(node) {
    this.node = node;
    this.nodeId = '';
    this.setNodeId = this.setNodeId.bind(this);
    this.setPeers = this.setPeers.bind(this);
    this.node.id().then(this.setNodeId);
    this.checkPeersTopic().then(this.setPeers);
    this.nodePublicKey = 'hello';
    this.publisherUrl = window.location.hostname;
    this.topic = 'publisher:ads:' + this.publisherUrl;
    this.receiveMsg = this.receiveMsg.bind(this);
    this.adResponseQueue = [];
    this.auctionQueue = [];
    this.topicPeers = [];
  }

  setNodeId(xyz) {
    this.nodeId = xyz;
  }

  setPeers(xyz){
    this.topicPeers = xyz;
  }

  subscribe(topic, receiveMsg) {
    this.node.pubsub.subscribe(topic, receiveMsg, (err) => {
      if (err) { throw err }
      console.log(`[INFO] Subscribed to topic: ${topic}`);
    })
  }
  receiveMsg(msg) {
    const message = JSON.parse(msg.data.toString());
    // console.log('[INFO] Message Received: ', message);
    if(message.type == 'response') {
      this.adResponseQueue.push(message);
      console.log('[INFO] Pushed to Response Queue: ', this.adResponseQueue);
      const b = requestMap.get(message.ad_id);
      const a = Date.now();
      console.log('[INFO] Latency of Roundtrip (ms):', a - b);
    }
  }

  checkPeers() {
    this.node.pubsub.peers(this.topic, (err, peerIds) => {
      if (err) { throw err };
      console.log('[INFO] Looking for peers (topic): ', peerIds)
    });
    this.node.swarm.peers({}, function(err, peers) {
      if (err) { throw err }; 
      console.log('[INFO] Looking for peers: ', peers)
    });
  }

  checkPeersTopic() {
    return new Promise((resolve, reject)=> {
      this.node.pubsub.peers(this.topic, (err, peerIds) => {
        if (err) { throw err };
        console.log('[INFO] Looking for peers (topic): ', peerIds)
        resolve(peerIds);
      });
    })

  }
  getPeersTopic(){
    this.node.pubsub.peers(this.topic, (err, peerIds) => {
      if (err) { throw err };
      console.log('[INFO] Looking for peers (topic): ', peerIds)
      return peerIds;
    });
  }

  publishAdRequest() {
    return new Promise((resolve, reject) => {
      const adRequest = utils.generateAdRequest(this.publisherUrl);
      const adRequestBuffer = Buffer.from(JSON.stringify(adRequest));
      this.node.pubsub.publish(this.topic, adRequestBuffer, (err) => {
        if (err) { throw err };
        console.log('[INFO] Ad Request sent: ', adRequest);
        requestMap.set(adRequest.ad_id, adRequest.req_ts)
        resolve(adRequest.ad_id);
      });
    })
  }

  auction(id) {
    return new Promise((resolve, reject) => {
      this.auctionQueue = this.adResponseQueue.filter(item => item.ad_id == id);
      this.auctionQueue.sort((a, b) => parseFloat(a.bid) - parseFloat(b.bid));
      if(!this.auctionQueue[0]) {
        resolve('default ad')
      }
      resolve(this.auctionQueue[0].brand);
    })
  }

  delay(adId){
    console.log('[INFO] Auction for id:', adId);
    return new Promise(function(resolve){
      setTimeout(function() { resolve(adId); }, 10000);
    })
  }

  simulate() {
    this.publishAdRequest()
      .then(adId => this.delay(adId))
      .then(adId => this.auction(adId))
      .then(winningAd => EventBus.$emit('auction-event', winningAd))
  }

}

node.on('error', err => console.error(err));

node.on('ready', () => node.id((err, info) => {
  if (err) { throw err };
  console.log('[INFO] IPFS node status: ', node.isOnline() ? 'online' : 'offline');
  console.log('[INFO] IPFS node id: ' + info.id);
  const n = new Node(node);
  window.n = n
  n.subscribe(n.topic, n.receiveMsg);
}));

