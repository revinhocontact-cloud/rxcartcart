
import React from 'react';
import { CampaignType, PaperSize, PosterConfig, CAMPAIGN_STYLES } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface PosterViewProps {
  config: PosterConfig;
  scale?: number; // For preview zooming (outer container)
  className?: string;
}

export const PosterView: React.FC<PosterViewProps> = ({ config, scale = 1, className = '' }) => {
  const { user } = useAuth();
  const styles = CAMPAIGN_STYLES[config.campaign || CampaignType.NORMAL];
  const layout = config.layout || {};
  
  // Aspect Ratios
  const aspectRatios = {
    [PaperSize.A3]: 'aspect-[297/420]',
    [PaperSize.A4]: 'aspect-[210/297]',
    [PaperSize.A5]: 'aspect-[148/210]',
    [PaperSize.A6]: 'aspect-[105/148]',
  };

  // Helper para gerar style de transform com suporte a cor opcional
  const getStyle = (key: 'productName' | 'price' | 'description' | 'priceBg' | 'logo') => {
      const item = layout[key];
      if (!item) return { transform: 'translate(0px, 0px) scale(1)' };
      
      const style: React.CSSProperties = {
          transform: `translate(${item.x}px, ${item.y}px) scale(${item.scale})`,
          transformOrigin: 'center',
          position: 'relative', // Ensure visual stacking works with transforms
          zIndex: key === 'priceBg' ? 5 : key === 'logo' ? 20 : 10 // PriceBg behind Price, Logo on top
      };

      if (item.color && key !== 'priceBg' && key !== 'logo') {
        style.color = item.color;
      }

      return style;
  };

  // Determine background styling
  const containerStyle: React.CSSProperties = {
      transform: `scale(${scale})`, 
      transformOrigin: 'top left',
  };

  if (config.backgroundImageUrl) {
      containerStyle.backgroundImage = `url(${config.backgroundImageUrl})`;
      containerStyle.backgroundSize = 'cover';
      containerStyle.backgroundPosition = 'center';
  }

  // Check if user is on FREE plan to show watermark
  // We check if user exists to avoid showing on public landing page demos if not logged in
  const showWatermark = user?.plan === 'FREE';

  return (
    <div 
      className={`relative shadow-lg overflow-hidden flex flex-col ${aspectRatios[config.size]} ${!config.backgroundImageUrl ? styles.bg : 'bg-white'} ${styles.text} ${className}`}
      style={containerStyle}
      id={`poster-preview-${config.id}`}
    >
      {/* --- CUSTOM ASSETS LAYERS --- */}
      
      {/* 1. Price Background (Splash) - Rendered absolutely based on layout center reference or similar logic */}
      {config.priceBgUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[5]">
              <img 
                  src={config.priceBgUrl} 
                  alt="Price BG" 
                  className="w-48 h-auto object-contain transition-transform"
                  style={getStyle('priceBg')}
              />
          </div>
      )}

      {/* 2. Logo - Rendered absolutely */}
      {config.logoUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[20]">
              <img 
                  src={config.logoUrl} 
                  alt="Logo" 
                  className="w-24 h-auto object-contain transition-transform"
                  style={getStyle('logo')}
              />
          </div>
      )}

      {/* --- STANDARD CONTENT (If not custom template, use standard layout structure) --- */}
      {/* If it IS a custom template (has background image), we center everything and let transforms handle position */}
      
      {!config.backgroundImageUrl ? (
          <>
            {/* Header / Campaign Label for Standard Styles */}
            <div className={`w-full text-center py-[5%] font-bold uppercase tracking-wide ${styles.accent} text-white shadow-sm z-10 relative`}>
                {config.campaign === CampaignType.OFFER && (
                    <div className="absolute -bottom-2 left-0 w-full h-4 bg-red-600 rounded-b-[50%] -z-10"></div>
                )}
                <span className="text-[2em] leading-none tracking-tighter">{styles.label}</span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-between p-[8%] text-center relative z-0">
                <div 
                    className="flex-1 flex items-center justify-center w-full mt-4 transition-transform z-10"
                    style={getStyle('productName')}
                >
                <h1 className="font-bold leading-tight line-clamp-3 text-[2.2em]">
                    {config.productName}
                </h1>
                </div>

                {config.description && (
                <p 
                    className="text-[1.2em] opacity-80 mb-2 font-medium transition-transform z-10"
                    style={getStyle('description')}
                >
                    {config.description}
                </p>
                )}

                <div 
                    className={`w-full rounded-xl p-2 mt-auto transition-transform z-10`}
                    style={getStyle('price')}
                >
                    {config.oldPrice && config.oldPrice > config.price && (
                        <div className="text-[1.5em] line-through opacity-60 font-semibold mb-[-10px]">
                        De R$ {config.oldPrice.toFixed(2).replace('.',',')}
                        </div>
                    )}

                    <div className="flex items-start justify-center leading-none font-black tracking-tighter">
                        <span className="text-[3em] mt-[0.2em] mr-1">R$</span>
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
          </>
      ) : (
          /* --- CUSTOM TEMPLATE LAYOUT (Absolute Centering Base) --- */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
               
               {/* Product Name Layer */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                   <h1 
                    className="font-bold leading-tight text-[2.2em] text-center w-3/4"
                    style={getStyle('productName')}
                   >
                       {config.productName}
                   </h1>
               </div>

               {/* Description Layer */}
               {config.description && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                   <p 
                    className="text-[1.2em] font-medium text-center w-3/4"
                    style={getStyle('description')}
                   >
                       {config.description}
                   </p>
                </div>
               )}

               {/* Price Layer */}
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[15]">
                   <div style={getStyle('price')}>
                        {config.oldPrice && config.oldPrice > config.price && (
                            <div className="text-[1.5em] line-through opacity-80 font-semibold mb-[-10px] text-center">
                            De R$ {config.oldPrice.toFixed(2).replace('.',',')}
                            </div>
                        )}
                       <div className="flex items-start justify-center leading-none font-black tracking-tighter">
                            <span className="text-[3em] mt-[0.2em] mr-1">R$</span>
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
          </div>
      )}
      
      {/* Footer Branding (Standard System) - Hidden if custom bg is used to keep clean, BUT watermark overrides this */}
      {!config.backgroundImageUrl && (
        <div className="w-full flex justify-between items-end px-4 py-2 text-[0.6em] opacity-80 absolute bottom-0 left-0 z-10">
            <span>CÓD: {config.productId.substring(0,6)}</span>
            <span className="font-bold">RexCart</span>
        </div>
      )}

      {/* --- WATERMARK FOR FREE PLAN --- */}
      {showWatermark && (
          <div className="absolute bottom-2 right-2 z-50 pointer-events-none">
              <span className="text-[8px] font-semibold text-slate-800 bg-white/70 px-2 py-0.5 rounded backdrop-blur-[2px] border border-white/20 shadow-sm">
                  Cartaz criado por: Rexcart
              </span>
          </div>
      )}
    </div>
  );
};
