import axios, { AxiosResponse } from 'axios';
import { SitecoreItem, SitecoreGraphQLResponse, SitecoreConfig } from '../types/sitecore';

export class SitecoreService {
  private config: SitecoreConfig;

  constructor(config?: Partial<SitecoreConfig>) {
    this.config = {
      endpoint: config?.endpoint || process.env.REACT_APP_SITECORE_ENDPOINT || 'http://localhost:3001/api/sitecore',
      apiKey: config?.apiKey || process.env.REACT_APP_SITECORE_API_KEY || '',
      siteName: config?.siteName || process.env.REACT_APP_SITECORE_SITE_NAME || 'website',
      language: config?.language || 'en'
    };
  }

  private buildGraphQLQuery(itemPath: string, includeChildren: boolean = true): string {
    return `
      query GetItem($path: String!, $language: String!, $siteName: String!) {
        item(path: $path, language: $language, siteName: $siteName) {
          id
          name
          displayName
          path
          templateId
          templateName
          fields {
            name
            value
            type
          }
          ${includeChildren ? `
          children {
            results {
              id
              name
              displayName
              path
              templateId
              templateName
              fields {
                name
                value
                type
              }
            }
          }
          ` : ''}
        }
      }
    `;
  }

  async getItem(itemPath: string, includeChildren: boolean = true): Promise<SitecoreItem> {
    try {
      const query = this.buildGraphQLQuery(itemPath, includeChildren);
      const variables = {
        path: itemPath,
        language: this.config.language,
        siteName: this.config.siteName
      };

      const response: AxiosResponse<SitecoreGraphQLResponse> = await axios.post(
        this.config.endpoint,
        {
          query,
          variables
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      if (response.data?.data?.item) {
        const item = response.data.data.item;
        return {
          ...item,
          children: item.children || []
        };
      }

      throw new Error('Item not found');
    } catch (error) {
      console.error('Error fetching Sitecore item:', error);
      throw error;
    }
  }

  async getItemByIds(itemIds: string[]): Promise<SitecoreItem[]> {
    try {
      const query = `
        query GetItems($ids: [String!]!, $language: String!, $siteName: String!) {
          items(ids: $ids, language: $language, siteName: $siteName) {
            results {
              id
              name
              displayName
              path
              templateId
              templateName
              fields {
                name
                value
                type
              }
            }
          }
        }
      `;

      const variables = {
        ids: itemIds,
        language: this.config.language,
        siteName: this.config.siteName
      };

      const response: AxiosResponse<any> = await axios.post(
        this.config.endpoint,
        {
          query,
          variables
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data?.data?.items?.results || [];
    } catch (error) {
      console.error('Error fetching Sitecore items:', error);
      throw error;
    }
  }

  getFieldValue(item: SitecoreItem, fieldName: string): string {
    const field = item.fields.find(f => f.name === fieldName);
    return field?.value || '';
  }

  // Quiz-specific methods
  async getQuizById(quizId: string): Promise<SitecoreItem> {
    try {
      const query = `
        query GetQuiz($quizId: String!, $language: String!, $siteName: String!) {
          item(id: $quizId, language: $language, siteName: $siteName) {
            id
            name
            displayName
            path
            templateId
            templateName
            fields {
              name
              value
              type
            }
            children {
              results {
                id
                name
                displayName
                templateName
                fields {
                  name
                  value
                  type
                }
              }
            }
          }
        }
      `;

      const variables = {
        quizId,
        language: this.config.language,
        siteName: this.config.siteName
      };

      const response: AxiosResponse<SitecoreGraphQLResponse> = await axios.post(
        this.config.endpoint,
        {
          query,
          variables
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      if (response.data?.data?.item) {
        return response.data.data.item;
      }

      throw new Error('Quiz not found');
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  }
}