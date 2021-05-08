const base = process.env.NODE_ENV === 'development' ? 'http://localhost:8003' : 'your-s3-bucket';

export default (id, assetType, card) => {
  if (!id) {
    return '';
  }

  if (assetType === 'card') {
    id = id.replace(/[^a-zA-Z0-9!_()\-\. ]/g, '').trim();
    id = id.replace('-evil-twin', '');

    if (card && card.name === 'Dark Æmber Vault') {
      return `${base}/${id}-${card.house.toLowerCase()}.png`;
    }

    return `${base}/${id}.png`;
  }

  return `${base}/${id}.png`;
};
