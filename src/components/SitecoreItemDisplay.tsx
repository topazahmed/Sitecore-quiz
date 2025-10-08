import React from 'react';
import { SitecoreItem } from '../types/sitecore';
import './SitecoreItemDisplay.scss';

interface SitecoreItemDisplayProps {
  item: SitecoreItem;
  showChildren?: boolean;
}

const SitecoreItemDisplay: React.FC<SitecoreItemDisplayProps> = ({ 
  item, 
  showChildren = true 
}) => {
  return (
    <div className="sitecore-item">
      <div className="item-header">
        <h3>{item.displayName || item.name}</h3>
        <span className="item-path">{item.path}</span>
      </div>

      <div className="item-details">
        <div className="detail-row">
          <strong>ID:</strong> {item.id}
        </div>
        <div className="detail-row">
          <strong>Template:</strong> {item.templateName}
        </div>
      </div>

      {item.fields.length > 0 && (
        <div className="item-fields">
          <h4>Fields</h4>
          <div className="fields-grid">
            {item.fields.map((field, index) => (
              <div key={index} className="field-item">
                <strong>{field.name}:</strong>
                <span className="field-value">{field.value}</span>
                <small className="field-type">({field.type})</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {showChildren && item.children && item.children.length > 0 && (
        <div className="item-children">
          <h4>Children ({item.children.length})</h4>
          <div className="children-list">
            {item.children.map((child) => (
              <SitecoreItemDisplay 
                key={child.id} 
                item={child} 
                showChildren={false} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SitecoreItemDisplay;