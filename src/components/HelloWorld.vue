<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>We are using the network created by users connected to our site, no servers, no exchanges, SSPs etc...
      <br>
      You can discover Publishers via our Ethereum hosted Token Curated Registry!
    </p>
    <h3>Join the fun at <a>https://bit.ly/2KUA3Cu</a></h3>
        <button v-on:click="setNodeData">START NODE</button>
        <button v-on:click="generateAdRequest">HOLD AUCTION</button>
    <p>
      <h1>{{sentAd}}{{winningAd}}</h1>
      <h2>Node information</h2> 
      <br>
      <strong>TCR Node ID:</strong> {{ nodeId }}
      <br>
      <strong>TCR Node Rating:</strong> {{ nodeScore }}
      <br>
      <strong>publicKey:</strong> {{publicKey.substr(0,60)}}...
      <br>
      <strong><h3>Connected Peers</h3></strong>
      <br>
      <ul id="peers-list">
        <li v-for="topicPeer in topicPeers">
          {{ topicPeer }}
        </li>
      </ul>
      {{setPeers()}}
    </p>


  </div>
</template>

<script>

import '../ipfs';
import { EventBus } from '../EventBus';

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      nodeId: '',
      publicKey: '',
      topicPeers: '',
      winningAd: '',
      sentAd: '',
      nodeScore:'',
    }
  },
  mounted() {
    EventBus.$on('auction-event',  payload => {
      this.winningAd = payload;
      this.sentAd = '';
    });
  },
  methods: {
    getTopicPeers: function() {
      this.topicPeers = n.checkPeersTopic()
    },
    setNodeData: function() {
      if(typeof n != 'undefined') {
      this.nodeId = n.nodeId.id;
      this.publicKey = n.nodeId.publicKey;
      this.nodeScore = 781;
      }
/*       this.nodeId = n.nodeId.id;
      this.publicKey = n.nodeId.publicKey;
      this.nodeScore = 781; */
      //this.topicPeers = n.setPeers;
    },
    fetchPeers: function() {
      if(typeof n != 'undefined') {
        n.node.pubsub.peers(this.topic, (err, peerIds) => {
        if (err) { throw err };
        this.topicPeers = peerIds
        console.log('[INFO] Looking for peers (topic): ', peerIds)
      });
      }
/*       n.node.pubsub.peers(this.topic, (err, peerIds) => {
        if (err) { throw err };
        this.topicPeers = peerIds */
        //console.log('[INFO] Looking for peers (topic): ', peerIds)

    },
    setPeers: function() {
      setTimeout(this.fetchPeers, 100)
      setTimeout(this.setNodeData, 100)
    },
    generateAdRequest: function() {
      this.sentAd = 'Awaiting bids...'
      this.winningAd = '';
      n.simulate();
    }
  },
  // Import the EventBus.
// Listen for the i-got-clicked event and its payload.
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
  color: #42b983;
}
h1{
  color: #42b983;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
p {
  padding:10px;
}
button {
    background-color: #42b983; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px;
}
</style>
