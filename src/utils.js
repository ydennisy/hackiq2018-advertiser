function generateAdRequest(publisherUrl) {
  const msg = {
    type: 'request',
    tcr_id: 'QmdF7jx9prJXZ8u57y55uGY69EgSULTdDrUkQZkhGiTQqV',
    tcr_rating: 781,
    ad_id: Math.floor((Math.random() * 100000) + 1),
    req_ts: Date.now(),
    publisherUrl: publisherUrl,
    data: {}
  };
  return msg;
};


export {
  generateAdRequest,
}