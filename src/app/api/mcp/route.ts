/**
 * MCP Server for AssetHawk
 * AI agents can call these endpoints to interact with AssetHawk
 * 
 * Based on Model Context Protocol (MCP) JSON-RPC 2.0
 */
import { NextRequest, NextResponse } from 'next/server';
import { turso, generateId } from '@/lib/turso';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { method, params, id } = body;

    let result;

    switch (method) {
      case 'tools/list':
        result = {
          tools: [
            {
              name: 'create_asset',
              description: 'Create a new asset with QR code',
              inputSchema: {
                type: 'object',
                properties: {
                  orgId: { type: 'string', description: 'Organization ID' },
                  assetTag: { type: 'string', description: 'Unique asset tag/ID' },
                  name: { type: 'string', description: 'Asset name' },
                  description: { type: 'string', description: 'Asset description' },
                  status: { type: 'string', enum: ['active', 'maintenance', 'retired'] },
                },
                required: ['orgId', 'assetTag', 'name']
              }
            },
            {
              name: 'get_asset',
              description: 'Get asset details by ID',
              inputSchema: {
                type: 'object',
                properties: {
                  assetId: { type: 'string', description: 'Asset ID' }
                },
                required: ['assetId']
              }
            },
            {
              name: 'list_assets',
              description: 'List all assets for an organization',
              inputSchema: {
                type: 'object',
                properties: {
                  orgId: { type: 'string', description: 'Organization ID' },
                  status: { type: 'string', description: 'Filter by status' }
                },
                required: ['orgId']
              }
            },
            {
              name: 'scan_asset',
              description: 'Record an asset scan event',
              inputSchema: {
                type: 'object',
                properties: {
                  assetId: { type: 'string', description: 'Asset ID' },
                  userId: { type: 'string', description: 'User performing scan' },
                  location: { type: 'string', description: 'Scan location' },
                  notes: { type: 'string', description: 'Scan notes' }
                },
                required: ['assetId']
              }
            },
            {
              name: 'generate_qr',
              description: 'Generate a QR code for an asset or property',
              inputSchema: {
                type: 'object',
                properties: {
                  content: { type: 'string', description: 'URL or data to encode' },
                  format: { type: 'string', enum: ['dataURL', 'svg', 'png'] }
                },
                required: ['content']
              }
            },
            {
              name: 'create_property',
              description: 'Create a property with QR code for PropertyPal',
              inputSchema: {
                type: 'object',
                properties: {
                  orgId: { type: 'string' },
                  propertyName: { type: 'string' },
                  address: { type: 'string' },
                  wifiSsid: { type: 'string' },
                  wifiPassword: { type: 'string' },
                  checkInTime: { type: 'string' },
                  checkOutTime: { type: 'string' }
                },
                required: ['orgId', 'propertyName']
              }
            },
            {
              name: 'get_audit_log',
              description: 'Get audit trail for an organization',
              inputSchema: {
                type: 'object',
                properties: {
                  orgId: { type: 'string' },
                  limit: { type: 'number', default: 100 }
                },
                required: ['orgId']
              }
            }
          ]
        };
        break;

      case 'tools/call':
        const { name, arguments: args } = params;
        result = await handleToolCall(name, args);
        break;

      default:
        return NextResponse.json({ error: `Unknown method: ${method}` }, { status: 400 });
    }

    return NextResponse.json({
      jsonrpc: '2.0',
      id,
      result
    });
  } catch (e: any) {
    return NextResponse.json({
      jsonrpc: '2.0',
      error: { code: -32603, message: e.message }
    }, { status: 500 });
  }
}

async function handleToolCall(toolName: string, args: Record<string, any>) {
  switch (toolName) {
    case 'create_asset': {
      const { orgId, assetTag, name, description, status } = args;
      const id = generateId();
      const qrData = `assethawk://asset/${id}`;
      
      await turso.execute({
        sql: `INSERT INTO assets (id, org_id, asset_tag, name, description, status, qr_data)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [id, orgId, assetTag, name, description, status || 'active', qrData]
      });

      await turso.execute({
        sql: `INSERT INTO audit_log (id, org_id, action, entity_type, entity_id, description)
              VALUES (?, ?, 'create', 'asset', ?, ?)`,
        args: [generateId(), orgId, id, `Created asset: ${name}`]
      });

      return { content: [{ type: 'text', text: `Asset created: ${name} (${assetTag}) with ID ${id}` }] };
    }

    case 'get_asset': {
      const { assetId } = args;
      const result = await turso.execute({
        sql: 'SELECT * FROM assets WHERE id = ?',
        args: [assetId]
      });
      if (result.rows.length === 0) {
        return { content: [{ type: 'text', text: 'Asset not found' }] };
      }
      return { content: [{ type: 'text', text: JSON.stringify(result.rows[0], null, 2) }] };
    }

    case 'list_assets': {
      const { orgId, status } = args;
      let sql = 'SELECT * FROM assets WHERE org_id = ?';
      const params = [orgId];
      if (status) { sql += ' AND status = ?'; params.push(status); }
      sql += ' ORDER BY created_at DESC LIMIT 50';
      
      const result = await turso.execute({ sql, args: params });
      return { content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }] };
    }

    case 'scan_asset': {
      const { assetId, userId, location, notes } = args;
      const scanId = generateId();
      
      await turso.execute({
        sql: `INSERT INTO audit_log (id, org_id, user_id, action, entity_type, entity_id, description, old_values)
              SELECT ?, org_id, ?, 'scan', 'asset', ?, ?, ?
              FROM assets WHERE id = ?`,
        args: [scanId, userId || 'agent', assetId, notes || `Scanned at ${location || 'unknown'}`, location, assetId]
      });

      return { content: [{ type: 'text', text: `Scan recorded for asset ${assetId}` }] };
    }

    case 'create_property': {
      const { orgId, propertyName, address, wifiSsid, wifiPassword, checkInTime, checkOutTime } = args;
      const id = generateId();
      
      await turso.execute({
        sql: `INSERT INTO properties (id, org_id, name, address, wifi_ssid, wifi_password, check_in, check_out)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [id, orgId, propertyName, address, wifiSsid, wifiPassword, checkInTime, checkOutTime]
      });

      const qrContent = `https://propertypal.com/p/${id}`;
      return { content: [{ type: 'text', text: `Property created: ${propertyName} (${id})\nQR content: ${qrContent}` }] };
    }

    case 'get_audit_log': {
      const { orgId, limit } = args;
      const result = await turso.execute({
        sql: 'SELECT * FROM audit_log WHERE org_id = ? ORDER BY created_at DESC LIMIT ?',
        args: [orgId, limit || 50]
      });
      return { content: [{ type: 'text', text: JSON.stringify(result.rows, null, 2) }] };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${toolName}` }] };
  }
}
