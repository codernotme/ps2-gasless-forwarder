import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export function NFTConverter() {
  const [tokenId, setTokenId] = useState('');
  const [contractAddress, setContractAddress] = useState('');

  const { data: metadata, isLoading, error } = useQuery<NFTMetadata>({
    queryKey: ['nftMetadata', contractAddress, tokenId],
    queryFn: async () => {
      if (!contractAddress || !tokenId) return null;
      const response = await fetch(
        `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}/`
      );
      return response.json();
    },
    enabled: !!contractAddress && !!tokenId
  });

  return (
    <div className="neo-card space-y-4">
      <h2 className="text-2xl font-black mb-4">NFT METADATA VIEWER</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xl font-bold mb-2">Contract Address</label>
          <input
            type="text"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            className="neo-input"
            placeholder="0x..."
          />
        </div>

        <div>
          <label className="block text-xl font-bold mb-2">Token ID</label>
          <input
            type="text"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            className="neo-input"
            placeholder="1"
          />
        </div>

        {isLoading && <div>Loading metadata...</div>}
        
        {error && (
          <div className="p-4 bg-red-500 text-white font-bold flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            Failed to load NFT metadata
          </div>
        )}

        {metadata && (
          <div className="neo-card-secondary">
            <img
              src={metadata.image}
              alt={metadata.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-xl font-bold">{metadata.name}</h3>
            <p className="text-gray-600 mb-4">{metadata.description}</p>
            
            <div className="grid grid-cols-2 gap-2">
              {metadata.attributes.map((attr, i) => (
                <div key={i} className="p-2 bg-gray-100 rounded">
                  <div className="font-bold">{attr.trait_type}</div>
                  <div>{attr.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}