import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления заказами UC в PUBG Mobile
    Методы: POST - создание заказа, GET - получение списка заказов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database configuration missing'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            player_id = body_data.get('player_id', '').strip()
            uc_amount = body_data.get('uc_amount', 0)
            bonus_uc = body_data.get('bonus_uc', 0)
            price = body_data.get('price', 0)
            
            if not player_id or not str(player_id).isdigit():
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid player_id'}),
                    'isBase64Encoded': False
                }
            
            if len(player_id) < 8 or len(player_id) > 12:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'player_id must be 8-12 digits'}),
                    'isBase64Encoded': False
                }
            
            if uc_amount <= 0 or price <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Invalid uc_amount or price'}),
                    'isBase64Encoded': False
                }
            
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO orders (player_id, uc_amount, bonus_uc, price, status) "
                "VALUES (%s, %s, %s, %s, 'pending') RETURNING id, created_at",
                (player_id, uc_amount, bonus_uc, price)
            )
            order_id, created_at = cursor.fetchone()
            conn.commit()
            cursor.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'id': order_id,
                    'player_id': player_id,
                    'uc_amount': uc_amount,
                    'bonus_uc': bonus_uc,
                    'price': price,
                    'status': 'pending',
                    'created_at': created_at.isoformat() if created_at else None
                }),
                'isBase64Encoded': False
            }
        
        elif method == 'GET':
            params = event.get('queryStringParameters') or {}
            player_id = params.get('player_id', '').strip()
            limit = min(int(params.get('limit', 50)), 100)
            
            cursor = conn.cursor()
            
            if player_id:
                cursor.execute(
                    "SELECT id, player_id, uc_amount, bonus_uc, price, status, created_at "
                    "FROM orders WHERE player_id = %s ORDER BY created_at DESC LIMIT %s",
                    (player_id, limit)
                )
            else:
                cursor.execute(
                    "SELECT id, player_id, uc_amount, bonus_uc, price, status, created_at "
                    "FROM orders ORDER BY created_at DESC LIMIT %s",
                    (limit,)
                )
            
            rows = cursor.fetchall()
            cursor.close()
            
            orders = []
            for row in rows:
                orders.append({
                    'id': row[0],
                    'player_id': row[1],
                    'uc_amount': row[2],
                    'bonus_uc': row[3],
                    'price': row[4],
                    'status': row[5],
                    'created_at': row[6].isoformat() if row[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'orders': orders, 'count': len(orders)}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()
