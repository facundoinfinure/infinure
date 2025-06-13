import { Injectable } from '@nestjs/common';

export const AIRBYTE_CONNECTORS = {
  databases: {
    postgres: 'decd338e-5647-4c0b-adf4-da0e75f5a750',
    mysql: 'b4389032-b9bb-4c1e-9a2e-3ad4c87b3e0c',
    mongodb: 'b5ea17b1-f170-46dc-bc31-cc744ca984c1',
    oracle: '8be1cf83-fde1-477f-a4ad-318d23c9f3c6',
    sqlserver: 'b5ea17b1-f170-46dc-bc31-cc744ca984c1',
    redis: 'b687c099-6f50-4d89-ab7f-e9b2e4c9c7b1',
    elasticsearch: 'c1b6c8c8-c8c8-4c8c-8c8c-c8c8c8c8c8c8'
  },
  dataWarehouses: {
    snowflake: 'b1c2c3d4-e5f6-7890-abcd-ef1234567890',
    bigquery: 'c2d3e4f5-g6h7-8901-bcde-f23456789012',
    redshift: 'd3e4f5g6-h7i8-9012-cdef-345678901234',
    databricks: 'e4f5g6h7-i8j9-0123-def0-456789012345'
  },
  saas: {
    salesforce: 'b7e4c55d-7867-4dcb-a856-c021a5c2a5a8',
    hubspot: 'f7864902-5566-4a22-be62-b64bd4b8252c',
    stripe: 'e094cb9a-26de-4645-8761-65c0c425d1de',
    shopify: 'c08cfb82-2c8b-4c14-9e77-fa1faf2c21c7',
    'google-analytics': 'aea4e1d7-3e29-4c8b-9c1b-7e3c3e3c3e3c',
    'facebook-marketing': 'e7778cfc-e97c-4458-9ecb-b4f2bbd8431c',
    'linkedin-ads': 'e02df5cd-3c3d-4b85-a8a6-e2e1e1e1e1e1',
    mailchimp: 'c8c8c8c8-c8c8-4c8c-8c8c-c8c8c8c8c8c8',
    intercom: 'd9d9d9d9-d9d9-4d9d-9d9d-d9d9d9d9d9d9',
    zendesk: 'e0e0e0e0-e0e0-4e0e-e0e0-e0e0e0e0e0e0'
  },
  files: {
    s3: 'b3bfc7b5-6b6b-4b6b-8b6b-b6b6b6b6b6b6',
    'google-sheets': 'a4a4a4a4-a4a4-4a4a-a4a4-a4a4a4a4a4a4',
    csv: 'e5e5e5e5-e5e5-4e5e-e5e5-e5e5e5e5e5e5',
    json: 'f6f6f6f6-f6f6-4f6f-f6f6-f6f6f6f6f6f6',
    ftp: 'g7g7g7g7-g7g7-4g7g-g7g7-g7g7g7g7g7g7'
  }
};

export interface ConnectorInfo {
  key: string;           // e.g. "postgres"
  name: string;          // Human-readable name
  category: string;      // databases | saas | files | dataWarehouses
  definitionId: string;  // Airbyte sourceDefinitionId
}

export function buildConnectorList(): ConnectorInfo[] {
  const list: ConnectorInfo[] = [];
  (Object.keys(AIRBYTE_CONNECTORS) as Array<keyof typeof AIRBYTE_CONNECTORS>).forEach((category) => {
    const group = AIRBYTE_CONNECTORS[category] as Record<string, string>;
    Object.entries(group).forEach(([key, definitionId]) => {
      list.push({
        key,
        name: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        category,
        definitionId
      });
    });
  });
  return list;
}

@Injectable()
export class ConnectorRegistry {
  private readonly allConnectors = buildConnectorList();

  /* eslint-disable @typescript-eslint/no-empty-function */
  constructor() {}

  getAllConnectors(): ConnectorInfo[] {
    return this.allConnectors;
  }

  getConnectorsByIndustry(industry: string): ConnectorInfo[] {
    const industryMappings: Record<string, string[]> = {
      fintech: ['postgres', 'stripe', 'salesforce', 'plaid', 'quickbooks'],
      healthcare: ['postgres', 'salesforce', 'epic', 'cerner', 'mongodb'],
      ecommerce: ['shopify', 'google-analytics', 'facebook-marketing', 'stripe', 'mailchimp'],
      saas: ['hubspot', 'intercom', 'mixpanel', 'amplitude', 'salesforce']
    };
    const keys = industryMappings[industry] || [];
    if (keys.length === 0) return this.allConnectors;
    return this.allConnectors.filter((c) => keys.includes(c.key));
  }
} 