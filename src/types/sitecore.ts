export interface SitecoreField {
  name: string;
  value: string;
  type: string;
}

export interface SitecoreItem {
  id: string;
  name: string;
  displayName: string;
  path: string;
  templateId: string;
  templateName: string;
  fields: SitecoreField[];
  children: SitecoreItem[];
}

export interface SitecoreGraphQLResponse {
  data: {
    item: SitecoreItem;
  };
}

export interface SitecoreConfig {
  endpoint: string;
  apiKey: string;
  siteName: string;
  language: string;
}