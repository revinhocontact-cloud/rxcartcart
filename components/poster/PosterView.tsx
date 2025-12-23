
import React from 'react';
import { CampaignType, PaperSize, PosterConfig, CAMPAIGN_STYLES } from '../../types';

interface PosterViewProps {
  config: PosterConfig;
  scale?: number; // For preview zooming (outer container)
  className?: string;
}

export const PosterView: React.FC<PosterViewProps> = ({ config, scale = 1, className = '' }) => {
  const styles = CAMPAIGN_STYLES[config.campaign];
  const layout = config.layout || {};
  
  // Aspect Ratios
  const aspectRatios = {
    [PaperSize.A3]: 'aspect-[297/420]',
    [PaperSize.A4]: 'aspect-[210/297]',
    [PaperSize.A5]: 'aspect-[148/210]',
    [PaperSize.A6]: 'aspect-[105/148]',
  };

  // Helper para gerar style de transform
  const getStyle = (key: 'productName' | 'price' | 'description') => {
      const item = layout[key];
      if (!item) return {};
      return {
          transform: `translate(${item.x}px, ${item.y}px) scale(${item.scale})`,
          transformOrigin: 'center'
      };
  };

  return (
    <div 
      className={`relative shadow-lg overflow-hidden flex flex-col ${aspectRatios[config.size]} ${styles.bg} ${styles.text} ${className}`}
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      id={`poster-preview-${config.id}`}
    >
      {/* Header / Campaign Label */}
      <div className={`w-full text-center py-[5%] font-bold uppercase tracking-wide ${styles.accent} text-white shadow-sm z-10 relative`}>
        {/* Curved decorative bottom if Offer */}
        {config.campaign === CampaignType.OFFER && (
             <div className="absolute -bottom-2 left-0 w-full h-4 bg-red-600 rounded-b-[50%] -z-10"></div>
        )}
        <span className="text-[2em] leading-none tracking-tighter">{styles.label}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between p-[8%] text-center relative z-0">
        
        {/* Product Name */}
        <div 
            className="flex-1 flex items-center justify-center w-full mt-4 transition-transform"
            style={getStyle('productName')}
        >
           <h1 className="font-bold leading-tight line-clamp-3 text-[2.2em]">
            {config.productName}
          </h1>
        </div>

        {/* Description */}
        {config.description && (
          <p 
            className="text-[1.2em] opacity-80 mb-2 font-medium transition-transform"
            style={getStyle('description')}
          >
              {config.description}
          </p>
        )}

        {/* Price Block */}
        <div 
            className={`w-full rounded-xl p-2 mt-auto transition-transform`}
            style={getStyle('price')}
        >
          
          {/* Old Price (if exists) */}
          {config.oldPrice && config.oldPrice > config.price && (
            <div className="text-[1.5em] line-through opacity-60 font-semibold mb-[-10px]">
              De R$ {config.oldPrice.toFixed(2).replace('.',',')}
            </div>
          )}

          <div className="flex items-start justify-center leading-none font-black tracking-tighter">
            <span className="text-[3em] mt-[0.2em] mr-1">R$</span>
            
            {/* Split Price */}
            <div className="flex items-baseline">
              <span className="text-[8em]">{Math.floor(config.price)}</span>
              <div className="flex flex-col items-start ml-1">
                <span className="text-[4em] -mb-2">,{config.price.toFixed(2).split('.')[1]}</span>
                <span className="text-[1.5em] font-medium text-opacity-70 uppercase tracking-widest self-end mr-2">
                  {config.unit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="w-full flex justify-between items-end px-4 py-2 text-[0.6em] opacity-80 absolute bottom-0 left-0 z-10">
         <span>CÓD DO PRODUTO: {config.productId.substring(0,6)}</span>
         <span className="font-bold">RexCart</span>
      </div>
    </div>
  );
};
