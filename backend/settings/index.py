import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для получения настроек проекта (контакты поддержки и т.д.)
    GET /settings - получить все настройки
    GET /settings?key=telegram_contact - получить конкретную настройку
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
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
    cursor = conn.cursor()
    
    try:
        params = event.get('queryStringParameters') or {}
        setting_key = params.get('key', '').strip()
        
        if setting_key:
            cursor.execute(
                "SELECT setting_key, setting_value FROM settings WHERE setting_key = %s",
                (setting_key,)
            )
            row = cursor.fetchone()
            
            if row:
                result = {row[0]: row[1]}
            else:
                result = {}
        else:
            cursor.execute("SELECT setting_key, setting_value FROM settings")
            rows = cursor.fetchall()
            result = {row[0]: row[1] for row in rows}
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
    
    finally:
        cursor.close()
        conn.close()
